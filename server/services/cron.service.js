import cron from 'node-cron';
import { checkDeadlinesAndNotify } from './notification.service.js';
import {runAllScrapers} from '../scrapers/index.scraper.js';
import Scholarship from '../models/sponsorsModels/scholarship.model.js';

export const startCronJobs = ()=>{
    try{
    cron.schedule('0 8 * * * ', async()=>{
        console.log('Running daily deadline check...');
        const today = new Date();
        const archiveScholarships = await Scholarship.updateMany(
            {
                "dates.deadline": {$lt: today},
                $or: [
                    {isActive: true},
                    {isArchived: false}
                ]
               
            },
            {
                $set: 
                    {
                        isActive:false,
                        isArchived:true
                    }
                
            }
        );

        

        if(archiveScholarships.modifiedCount > 0){
            console.log(`[Cron Tasks] Successfully archived ${archiveScholarships.modifiedCount} expired scholarships`);
        }
        
        await checkDeadlinesAndNotify();
    });
    }catch(error){

        console.error('[Cron Task Error] Failed to run daily checks', error.message);
    }

    

    cron.schedule('0 6 * * 1', async ()=>{
        console.log('Running weekly scholarship scraper...');
        await runAllScrapers();
    });


    
    console.log('Cron jobs started');
}

