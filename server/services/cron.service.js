import cron from 'node-cron';
import { checkDeadlinesAndNotify } from './notification.service.js';

export const startCronJobs = ()=>{
    cron.schedule('0 8 * * * ', async()=>{
        console.log('Running daily deadline check...');
        await checkDeadlinesAndNotify();
    });

    console.log('Cron jobs started');
}