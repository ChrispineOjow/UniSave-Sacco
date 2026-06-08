import StudentProfile from "../../models/studentModels/studentProfile.model.js";
import StudentAuth from "../../models/studentModels/studentAuth.model.js";


export const createStudentProfile = async (req, res)=>{
    try{

        const studentAuthId = req.student?._id || req.body.studentAuthId;
        if(!studentAuthId){
            return res.status(401).json({
                message: "Unaouthorized. Valid student session required"
            })
        }
        
        const {
            studentAuthId, 
            firstName, 
            lastName, 
            surName, 
            gender,
            age,
            university, 
            course, 
            yearOfStudy,
            schoolRegistrationNumber, 
            gpa,
            county,
            constituency,
            disability,
            MTI_Score, 
            phoneNumber} = req.body;

        const authStudent = await StudentAuth.findById(studentAuthId);
        
        if(!authStudent){
            return res.status(404).json(
                {
                    message: 'Student not found'
                });
        };

        if(authStudent.accountStatus !== 'approved'){
            return res.status(403).json(
                {
                    message: 'Account not yet approved. Please wait for approval'
                }
            )
        }

        const existingProfile = await StudentProfile.findOne({studentAuthId});
        if(existingProfile){
            return res.status(400).json(
                {
                    message: 'Profile already exists for this student'
                });
        };

        const newProfile = new StudentProfile({
            studentAuthId,
            nationalId: authStudent.nationalId,
            email:authStudent.email,
            firstName,
            lastName,
            surName,
            gender,
            age,
            university,
            course,
            yearOfStudy,
            schoolRegistrationNumber,
            gpa,
            county,
            constituency,
            disability: disability ?? false, // Deafulting to false if it is not provided
            MTI_Score,
            phoneNumber
        });

        await newProfile.save();
        res.status(201).json(
            {
                message: 'Student profile saved successfully',
                studentProfile: newProfile
            });


    }catch(error){

        console.error("CRASH LOG FOR CREATE_PROFILE: ", error);
        res.status(500).json({
            message: 'Error creating student profile',
            error: error.message
        });
    }
}

export const getMyProfile = async (req, res)=>{
    try{

        const profile = await StudentProfile.findOne({
            studentAuthId: req.student._id
        })

        if(!profile){
            return res.status(404).json({
                message: 'Profile not found. Please complete your profile'
            });
        }

        res.status(200).json(
            {
                profile
            }
        )

    }catch(error){

        res.status(500).json(
            {
                message: "Error fetching profile",
                error: error.message
            }
        )

    }
}

export const updateStudentProfile = async (req, res)=>{
    try{

        const profile = await StudentProfile.findOneAndUpdate(
            {studentAuthId: req.student._id},
            {$set: req.body},
            {returnDocument: 'after', runValidators: true}
        );

        if(!profile){
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        return res.status(200).json({
                message: "Profile updated successfully",
                profile
            })


    }catch(error){

        res.status(500).json({
            message: "Error updating profile",
            error: error.message
        })

    }
}