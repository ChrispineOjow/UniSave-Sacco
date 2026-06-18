import { scrapeHELB } from './helb.scraper.js';
import { scrapeHEF } from './hef.scraper.js';
import { scrapeEquity } from './equity.scraper.js';
import {scrapeUSIU} from './usiu.scraper.js';


export const runAllScrapers = async () => {
    console.log('Starting all scrapers...');

    const results = await Promise.allSettled([
        scrapeHELB(),
        scrapeHEF(),
        scrapeEquity(),
        scrapeUSIU()
     
    ]);

    let totalSaved = 0;
    results.forEach((result, index) => {
        const scrapers = ['HELB', 'HEF', 'Equity', 'USIU'];
        if(result.status === 'fulfilled'){
            totalSaved += result.value;
        } else {
            console.error(`${scrapers[index]} failed:`, result.reason);
        }
    });

    console.log(`Scraping complete — ${totalSaved} total scholarships saved`);
    return totalSaved;
}