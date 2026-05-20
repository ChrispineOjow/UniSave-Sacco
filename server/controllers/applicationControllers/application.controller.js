import Application from "../../models/applicationModels/scholarshipApplication.models.js";
import Scholarship from "../../models/sponsorsModels/scholarship.model.js";
import StudentProfile from "../../models/studentModels/studentProfile.model.js";


//Save a scholarship
export const saveScholarship = async (req , res)=> {

    try{
        const {scholarshipId} = req.body;

        const scholarship = await Scholarship.findById(scholarshipId);
        if(!scholarship){
            return res.status(404).json({message:"scholarship not found"})
        }

        const profile = await StudentProfile.findOne(
            {
                studentAuthId: req.student._id
            }
        );

        if(!profile){
            return res.status(404).json({
                message: "Please complete your profile first"
            })
        }

        const existing = await Application.findOne({
            studentId: profile._id,
            scholarshipId
        });

        if(existing){
            return res.status(400).json(
                {
                    message: "Scholarship already saved"
                }
            )
        };

        const application = new Application({
            studentId: profile._id,
            scholarshipId,
            status: 'Saved',
            appliedAt: null
        });

        await application.save();

        res.status(201).json({
            message: "Scholarship saved successfully",
            application
        })

    }catch(error){

        res.status(500).json(
            {
                message: "Error saving sponsorship",
                error: error.message
            }
        )

    }
}

//Applying for Scholarship

export const applyForScholarship = async (req, res)=>{

    try{

        const {scholarshipId} = req.body;

        const profile = await StudentProfile.findOne({
            studentAuthId: req.student._id
        });

        if(!profile){
            return res.status(404).json({
                message:"Please complete your profile first"
            })
        }

        let application = await Application.findOne({
            studentId: profile._id,
            scholarshipId
        })

        if(application){

            if(application.status === 'Applied'){
                return res.status(400).json(
                    {
                        message: "You have already applied for this scholarship"
                    }
                )
            }

            application.status="Applied";
            application.appliedAt = new Date();
            await application.save();

        }else{
            application = new Application({
                studentId: profile._id,
                scholarshipId,
                status: 'Applied',
                appliedAt: new Date()
            })

            await application.save();
        }

        res.status(200).json({
            message:"Application submitted successfully",
            application 
        })


    }catch(error){
        res.status(500).json({
            message: "Error applying for scholarship",
            error: error.message
        })
    }
}

//Get my Application 
export const getMyApplication = async(req, res)=> {

    try{

        const profile = await StudentProfile.findOne({
            studentAuthId: req.student._id
        })
        if(!profile){
            return res.status(404).json({message: "Please fill your profile first"})
        }

        const applications = await Application.find({
            studentId: profile._id
        }).populate('scholarshipId', 'title provider category funding dates link');

        res.status(200).json(
            {
                count: applications.length,
                applications
            }
        )

    }catch(error){

        res.status(500).json(
            {
                message: "Error fetching applications",
                error: error.message
            }
        )
    }
}


//Update the Application
export const updateApplicationStatus = async(req, res)=>{

    try{

        const {id} = req.params;
        const {status, notes} = req.body;

        const allowedStatuses = ['Applied','Pending'];
        if(!allowedStatuses.includes(status)){
            return res.status(400).json({
                message:` Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
            })
        }

        const profile = await StudentProfile.findOne({
            studentAuthId: req.student._id
        });

        const application = await Application.findOne({
            _id:id,
            studentId:profile._id
        })

        if(!application){
            return res.status(404).json({
                message:"Application not found"
            })
        }

        application.status = status;
        if(notes) application.notes = notes;
        if(status === 'Applied' && !application.appliedAt){
            application.appliedAt = new Date();
        }

        await application.save();

        res.status(200).json(
            {
                message: 'Application status updated successfully',
                application
            }
        )

    }catch(error){

        res.status(500).json({
            message: "Error updating application status",
            error: error.message
        })
    }
}


// Delete Application that is Unsaved
export const deleteApplication = async(req, res)=>{
    try{

        const {id} = req.params;

        const profile = await StudentProfile.findOne({
            studentAuthId: req.student._id
        })

        const application = await Application.findOne({
            _id:id,
            studentId: profile._id
        })

        if(!application){
            return res.status(404).json({
                message: "Application not found"
            })
        }

        if(application.status !== 'Saved'){
            return res.status(400).json(
                {
                    message: ' Cannot delete an application that has already been submitted'
                }
            );
        }

        await application.deleteOne();

        res.status(200).json(
            {
                message: "Scholarship removed from saved list"
            }
        )

    }catch(error){

        res.status(500).json({
            message: "Error deleting application",
            error: error.message
        })

    }
}