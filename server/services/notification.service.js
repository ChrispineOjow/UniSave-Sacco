import Application from '../models/applicationModels/scholarshipApplication.models.js';
import StudentProfile from '../models/studentModels/studentProfile.model.js';
import StudentAuth from '../models/studentModels/studentAuth.model.js';
import Scholarship from '../models/sponsorsModels/scholarship.model.js';
import { sendDeadlineReminder } from '../utils/email.utils.js';

export const checkDeadlinesAndNotify = async()=>{
    try{

        console.log('Checking scholarship deadlines')
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime()+ 7*24*60*60*1000);

        const upcomingScholarships = await Scholarship.find(
            {
                isActive:true,
                'dates.deadline':{
                    $gte:now,
                    $lte:sevenDaysFromNow
                }
            }
        );

        if(upcomingScholarships.length === 0 ){
            console.log(`No upcoming deadlines in the next 7 days`);
            return;
        }

        console.log(`Found ${upcomingScholarships.length} upcoming deadlines`)

        for(const scholarship  of upcomingScholarships){
            const applications = await Application.find({
                scholarshipId:scholarship._id,
                status: {$in :['Saved','Applied','Pending']}
            })
        

        const daysLeft = Math.ceil(
            (new Date(scholarship.dates.deadline)-now)/(1000*60*60*24)
        )

        for(const application of applications){
            const profile = await StudentProfile.findById(application.studentId);
            if(!profile) continue

            const auth = await StudentAuth.findById(profile.studentAuthId);
            if(!auth) continue;


            await sendDeadlineReminder(
                auth.email,
                `${profile.firstName} ${profile.lastName}`,
                scholarship,
                daysLeft
            );}
        }

        console.log(`Deadline check complete`)

        console
    }catch(error){

        console.error(`Error checking deadlines: `, error.message)

    }
}