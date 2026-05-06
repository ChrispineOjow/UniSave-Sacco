import StudentProfile from "../../models/studentModels/studentProfile.model.js";
import StudentAuth from "../../models/studentModels/studentAuth.model.js";

export const createStudentProfile = async (req, res)=>{
    try{

        const {studentAuthId, firstName, lastName, surName, university, course, schoolRegistrationNumber, MTI_Score, phoneNumber} = req.body;

        const authStudent = await StudentAuth.findById(studentAuthId);
        
        if(!authStudent){
            return res.status(404).json({message: 'Student not found'})
        }

        const existingProfile = await StudentProfile.findOne({studentAuthId});
        if(existingProfile){
            return res.status(400).json({message: 'Profile already exists for this student'});
        }

        const newProfile = new StudentProfile({
            studentAuthId,
            nationalId: authStudent.nationalId,
            email:authStudent.email,
            firstName,
            lastName,
            surName,
            university,
            course,
            schoolRegistrationNumber,
            MTI_Score,
            phoneNumber
        });

        await newProfile.save();
        res.status(201).json({message: 'Student profile saved successfully', studentProfile: newProfile});


    }catch(error){
        res.status(500).json({message: 'Error creating student profile', error: error.message});
    }
}