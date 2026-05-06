import StudentAuth from "../../models/studentModels/studentAuth.model.js";
import bcrypt from 'bcrypt';


// Simulated National ID verification function
const verifyNationalId = async (nationalId) => {
    
    const isValidFormat = /^\d{8}$/.test(nationalId);
    return isValidFormat;
    
};

export const registerStudent = async (req, res)=>{
    try{

        const {nationalId, email, password} = req.body;

        const isVerified = await verifyNationalId(nationalId);

        if(!isVerified){
            return res.status(400).json({message: 'National ID verification failed. Please check your ID Number'});
        }

        const existingStudent = await StudentAuth.findOne({nationalId});

        if(existingStudent){
            return res.status(400).json({message: 'Student already registered'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        

        const newStudentAuth = new StudentAuth({
            nationalId,
            email,
            password: hashedPassword
        });

        await newStudentAuth.save();
        res.status(201).json({message: 'Student registered successfully', 
            studentAuth: {
                nationalId: newStudentAuth.nationalId,
                email: newStudentAuth.email,
                accountStatus: newStudentAuth.accountStatus,
                createdAt: newStudentAuth.createdAt
            }
        });

    }catch(error){

        res.status(500).json({message: 'Error registering student', error: error.message});
    }
}

export const getAllStudents = async (req, res)=>{
    try{

        const students = await StudentAuth.find().select('-password');
        res.status(200).json({students});
    }catch(error){

        res.status(500).json({message: 'Error fetching students', error: error.message});

    }
}