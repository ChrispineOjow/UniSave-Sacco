import Admin from "../../models/adminModels/admin.model.js";
import StudentAuth from "../../models/studentModels/studentAuth.model.js";
import StudentProfile from "../../models/studentModels/studentProfile.model.js";
import Scholarship from "../../models/sponsorsModels/scholarship.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const loginAdmin = async (req, res)=>{
    try{

        const {email, password} = req.body;

        const admin = await Admin.findOne({email});
        if(!admin){
            return res.status(400).json(
                {
                    message: 'Admin not found'
                }
            )
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if(!isPasswordCorrect){
            return res.status(401).json(
                {
                    message: 'Invalid Credentials'
                }
            )
        }


        const token = jwt.sign(
            {
                id: admin._id,
                email: admin.email,
                role: admin.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        )

        res.status(200).json(
            {
                message: 'Admin logged in successfully',
                token,
                admin: {
                    id: admin._id,
                    email: admin.email,
                    role: admin.role

                }
            }
        );
    }catch(error){

        res.status(500).json(
            {
                message: "Error logging in",
                error: error.message
            }
        )
        
    }
}

//Logout From admin

export const logoutAdmin = async (req, res) => {

    try{

        // logout is handled on the client side
        message: "Logout Successful"

    }catch(error){

        res.status(500).json({
            message: "Error logging out",
            error: error.message
        })
    }
}

//Fetching pending Students for admin dashboard
export const getPendingStudents = async (req, res) => {
    try{

        const pendingStudents = await StudentAuth.find({
            accountStatus: 'pending'
        }).select('-password');

        res.status(200).json(
            {
                count: pendingStudents.length,
                students: pendingStudents
            }
        )

    }catch(error){

        res.status(500).json(
            {
                message: "Error fetching students",
                error: error.message
            }
        )

    }
}

// Admin fetching all students all statuses
export const getAllStudents = async (req, res)=>{
    try{

        const students = await StudentAuth.find().select('-password');

        res.status(200).json(
            {
                count: students.length,
                students
            }
        )

    }catch(error){

        res.status(500).json(
            {
                message: 'Error fetching students',
                error: error.message
            }
        )
    }
}

// Approve students
export const approveStudent = async (req, res)=>{
    try{

        const {studentId} = req.params;

        const student = await StudentAuth.findById(studentId);
        if(!student){
            return res.status(404).json(
                {
                    message: 'Student not found'
                }
            )
        }

        if(student.accountStatus !== 'pending'){
            return res.status(400).json(
                {
                    message: "Student already approved"
                }
            )
        }

        student.accountStatus = 'approved';
        await student.save();

        res.status(200).json(
            {
                message: `Student ${student.email} approved successfully`,
                student:{

                    id : student._id,
                    email: student.email,
                    accountStatus: student.accountStatus

                }
            }
        );

    }catch(error){

        res.status(500).json(
            {
                message: "Error approving student",
                error: error.message
            }
        );
    }
}

//Reject Student

export const rejectStudent = async (req, res)=>{
    try{

        const {studentId} = req.params;

        const student = await StudentAuth.findById(studentId);
        if(!student){
            return res.status(404).json(
                {
                    message: 'Student not found'
                }
            );
        }

        if(student.accountStatus === 'rejected'){
            return res.status(400).json(
                {
                    message: 'Student already rejected'
                }
            )
        }

        student.accountStatus = 'rejected';
        await student.save();

        res.status(200).json(
            {
                message: `Student ${student.email} rejected.`,
                student: {
                    id: student._id,
                    email: student.email,
                    accountStatus: student.accountStatus
                }
            }
        )

    }catch(error){

        res.status(500).json(
            {
                message: "Error rejecting student",
                error: error.message
            }
        )
    }
}


//Create Another Admin (Only for super admins)
export const createAdmin = async (req, res)=> {
    try{

        const {email, password, role} = req.body;
         
        //Only super admins can create other admins
        if(req.admin.role !==  'superadmin'){
            return res.status(403).json(
                {
                    message: "Only super admins can create admins"
                }
            )
        }

        const existingAdmin = await Admin.findOne({email});
        if(existingAdmin){
            return res.status(400).json(
                {
                    message: 'Admin already exists'
                }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin =await Admin.create({
            email,
            password: hashedPassword,
            role: role || 'moderator'
        });

        res.status(201).json({
            message: 'Admin created successfully',
            admin: {
                id: newAdmin._id,
                email: newAdmin.email,
                role: newAdmin.role
            }
        });

    }catch(error){

        res.status(500).json(
            {
                message: 'Error creating admin',
                error: error.message
            }
        )

    }
}

// Add Scholarship
export const addScholarship = async  (req, res)=>{

    try{

        const scholarship = new Scholarship(req.body);
        await scholarship.save();

        res.status(201).json(
            {
                message: 'Scholarship added successfully',
                scholarship
            }
        );


    }catch(error){

        res.status(500).json(
            {
                message: "Error adding scholarship",
                error: error.message
            }
        )


    }
}


//Update Scholarship

export const updateScholarship = async (req, res)=>{
    try{

        const {id} = req.params;

        const scholarship = await Scholarship.findByIdAndUpdate(
            id,
            {$set: req.body},
            {returnDocument: 'after', runValidators: true}
        );

        if(!scholarship){
            return res.status(404).json(
                {
                    message: "Scholarship not found"
                }
            )
        }

        res.status(200).json(
            {
                message : "Scholarship Updated successfully",
                scholarship
            }
        )

    }catch(error){

        res.status(500).json({
            message: "Error updating scholarship",
            error: error.message
        })

    }
}

//Delete Scholarship
export const deleteScholarship = async(req, res)=> {

    try{

        const {id} = req.params;
        const scholarship = await Scholarship.findByIdAndDelete(id);

        if(!scholarship){
            return res.status(404).json(
                {
                    message: "Scholarship not found"
                }
            )
        };

        res.status(200).json(
            {
                message: "Scholarship deleted successfully"
            }
        )


    }catch(error){

        res.status(500).json(
            {
                message : "Scholarship was not deleted an error occured",
                error: error.message
            }
        )
    }
}

// Verify Scholarship
export const verifyScholarship = async (req, res) => {
    try{

        const {id} = req.params;

        const scholarship = await Scholarship.findByIdAndUpdate(
            id,
            {isVerified: true},
            {returnDocument: 'after'}
        );

        if(!scholarship){
            return res.status(404).json(
                {
                    message: "Scholarship not found"
                }
            )
        }

        res.status(200).json(
            {
                message: "Scholarship verified successfully",
                scholarship
            }
        )


    }catch(error){

        res.status(500).json(
            {
                message: "Error verifying scholarship",
                error: error.message
            }
        )
    }
}


// Get all Scholrship Including the Unverified ones

export const getAllScholarshipsAdmin = async(req, res)=> {

    try{
        const scholarships = await Scholarship.find().sort({createdAt: -1});

        res.status(200).json({
            count: scholarships.length,
            scholarships
        })


    }catch(error){
        res.status(500).json({
            message: "Error getting all Scholarships",
            error: error.message
        })
    }
}