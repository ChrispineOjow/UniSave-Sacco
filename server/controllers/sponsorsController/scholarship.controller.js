import Scholarship from "../../models/sponsorsModels/scholarship.model.js";
import StudentProfile from "../../models/studentModels/studentProfile.model.js";

//Get all Active Scholarships

export const getAllScholarships = async(req , res)=> {
    try{

        const {
            category, 
            county, 
            fundingType,
            search
        } = req.query;

        const filter = { isActive: true, isVerified: true};

        if(category) filter.category = category;
        if(county) filter['eligibility.county'] = { $in :[county, 'All']};
        if(fundingType) filter['funding.fundingType'] = fundingType;
        if(search) filter.title = { $regex: search, $options: 'i'};

        const scholarships = await Scholarship.find(filter).sort({isFeatured:-1, 'dates.deadline': 1})

        res.status(200).json(
            {
                count: scholarships.length,
                scholarships
            }
        )

    }catch(error){

        res.status(500).json(
            {
                message: "Error fetching Scholarships"
            }
        )
    }
}

//Get a single Scholarship
export const getScholarshipById = async (req, res)=>{
    try{

        const { id } = req.params;

        const scholarship = await Scholarship.findById(id);

        if(!scholarship){
            return res.status(404).json(
                {
                    message: "Scholarship not found"
                }
            )
        }

        res.status(200).json(
            {
                scholarship
            }
        )

    }catch(error){

        res.status(500).json(
            {
                message: "Error Fetching Scholarship",
                error:error.message
            }
        )

    }
}

//Getting Matched Scholarships
export const getMatchedSholarships = async (req, res)=> {

    try{

        const profile = await StudentProfile.findOne(
            {
                studentAuthId: req.student._id
            }
        )

        if(!profile){
            return res.status(404).json({
                message: "Please complete your profile to get matched scholarships"
            })
        }

        const scholarships = await Scholarship.find(
            {
                isActive: true,
                isVerified: true
            }
        );

        const matched = scholarships.filter(s => {
            const e = s.eligibility;

            const meetsMTI = profile.MTI_Score >= e.mtiScoreMin && profile.MTI_Score <= e.mtiScoreMax;
            const meetsMTIBand = e.mtiBand === 'All' || e.mtiBand === profile.MTI_Band;
            const meetsGPA = !e.minGPA || profile.gpa >= e.minGPA;
            const meetsYear = e.yearOfStudy.includes(profile.yearOfStudy);
            const meetsCourse = e.courseOfStudy.includes('All') || e.courseOfStudy.includes(profile.course);
            const meetsUniversity = e.university.includes('All') || e.university.includes(profile.university);
            const meetsCounty = e.county === 'All' || e.county === profile.county;
            const meetsGender = e.gender === 'All' || e.gender === profile.gender;
            const meetsAge = profile.age >= e.ageMin && profile.age <= e.ageMax;
            const meetsDisability = e.disability === null || e.disability === profile.disability;


            return meetsMTI && meetsMTIBand && meetsGPA && meetsYear && meetsCourse && meetsUniversity && meetsCounty && meetsGender && meetsAge && meetsDisability;
        });

        res.status(200).json(
            {
                count: matched.length,
                scholarships: matched
            }
        )

    }catch(error){
        res.status(500).json(
            {
                message: "Error occured while matching student to scholarship",
                error: error.message
            }
        )
    }
}

export const  updateScholarship = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        
        delete updates._id;
        delete updates.isVerified; 
        delete updates.createdAt;

        const scholarship = await Scholarship.findById(id);

        if (!scholarship) {
            return res.status(404).json({ message: 'Scholarship not found' });
        }

        
        if (updates.dates) {
            scholarship.dates = { ...scholarship.dates.toObject(), ...updates.dates };
            scholarship.markModified('dates');
            delete updates.dates;
        }
        if (updates.funding) {
            scholarship.funding = { ...scholarship.funding.toObject(), ...updates.funding };
            scholarship.markModified('funding');
            delete updates.funding;
        }
        if (updates.application) {
            scholarship.application = { ...scholarship.application.toObject(), ...updates.application };
            scholarship.markModified('application');
            delete updates.application;
        }

        Object.assign(scholarship, updates);


        await scholarship.save();


        return res.status(200).json({
            message: 'Scholarship updated successfully',
            scholarship
        });

    } catch (error) {
        console.error('CRASH LOG FOR UPDATE_SCHOLARSHIP:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid scholarship ID' });
        }

        return res.status(500).json({ message: 'Failed to update scholarship' });
    }
};