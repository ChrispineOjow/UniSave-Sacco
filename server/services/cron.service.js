import cron from 'node-cron';
import { checkDeadlinesAndNotify } from './notification.service.js';
import {runAllScrapers} from '../scrapers/index.scraper.js';

export const startCronJobs = ()=>{
    cron.schedule('0 8 * * * ', async()=>{
        console.log('Running daily deadline check...');
        await checkDeadlinesAndNotify();
    });

    cron.schedule('0 6 * * 1', async ()=>{
        console.log('Running weekly scholarship scraper...');
        await runAllScrapers();
    });
    
    console.log('Cron jobs started');
}