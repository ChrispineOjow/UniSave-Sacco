import StudentAuth from "../../models/studentModels/studentAuth.model.js";
import StudentProfile from "../../models/studentModels/studentProfile.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const verifyNationalId = (nationalId)=> /^\d{8}$/.test(nationalId);
const verifyEmail = (email) => /^\S+@\S+\.\S+$/.test(email);


export const registerStudent = async (req, res)=>{
    try{

        const {nationalId, email, password} = req.body;

        if(!verifyNationalId(nationalId)){
            return res.status(400).json(
                {
                    message: 'Invalid National Id. Must be at 8 digits'
                }
            )
        }

        if(!verifyEmail(email)){
            return res.status(400).json(
                {
                    message:"Invalid Email format"
                }
            )
        }


        //Check if student with same nationalId or email already exists
        const existingStudent = await StudentAuth.findOne({

            $or: [{nationalId}, {email}]

        });

        if(existingStudent){
            return res.status(400).json(
                {
                    message: 'Student already registered'
                }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newStudentAuth = new StudentAuth({
            nationalId,
            email,
            password: hashedPassword
        });

        await newStudentAuth.save();

        res.status(201).json({
            message: 'Student registered successfully', 
            studentAuth: {
                nationalId: newStudentAuth.nationalId,
                email: newStudentAuth.email,
                accountStatus: newStudentAuth.accountStatus,
                createdAt: newStudentAuth.createdAt
            }
        });

    }catch(error){

        res.status(500).json(
            {
                message: 'Error registering student', 
                error: error.message
            });
    }
}

export const loginStudent = async (req, res)=>{
    try{

        const {email, password} = req.body;

        const student = await StudentAuth.findOne({ email});
        // check if student exists
        if(!student){
            return res.status(404).json(
                {
                    message: "Student account not found"
                }
            )
        }

        //Check Status of account
        if (student.accountStatus !== 'pending'){
            return res.status(403).json({
                message: 'Account is pending admin approval'
            })
        }

        if (student.accountStatus === 'rejected'){
            return res.status(403).json(
                {
                    message: "Your account registration was rejected. Please contact support for assistance."
                }
            )
        }

        //Check passsword
        const isPasswordValid = await bcrypt.compare(password, student.password);
        if(!isPasswordValid){
            return res.status(401).json(
                {
                    message: "Invalid credentials"
                }
            )
        };

        const profile = await StudentProfile.findOne({ studentAuthId: student._id });

        //Generating token
        const token = jwt.sign(
            {
                id: student._id,
                nationalId: student.nationalId,
                email: student.email,
                accountStatus: student.accountStatus
            },
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.status(200).json({
            message: 'Login Successful',
            token,
            student: {
                id: student._id, 
                email: student.email,
                accountStatus: student.accountStatus,
                hasProfile: !!profile,
                profile: profile || null
            }
        })

    }catch(error){

        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });

    }
}

export const logoutStudent = async (req, res)=>{

    try{

        res.status(200).json({
            // logout is handled on client side because jwt is stateless.
            message: 'Logout Successful'
        })

    }catch(error){

        res.status(500).json({
            message: 'Error logging out',
            error: error.message
        });
    }
}
export const getAllStudents = async (req, res)=>{
    try{

        const students = await StudentAuth.find().select('-password');
        res.status(200).json({students});
    }catch(error){

        res.status(500).json(
            {
                message: 'Error fetching students', 
                error: error.message
            });

    }
}