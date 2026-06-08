import axios from 'axios';
import * as cheerio from 'cheerio';
import Scholarship from '../models/sponsorsModels/scholarship.model.js';

export const scrapeEquity = async () => {
    try {
        console.log('Scraping Equity Wings to Fly...');

        const { data } = await axios.get(
            'https://equitygroupfoundation.com/programmes/wings-to-fly',
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                },
                timeout: 10000
            }
        );

        const $ = cheerio.load(data);

        const description = $('meta[name="description"]').attr('content')
            || $('p').first().text().trim()
            || 'Full scholarship for top needy students in Kenya';

        const scholarship = {
            title: 'Equity Wings to Fly Scholarship',
            provider: 'Equity Group Foundation',
            category: 'Corporate',
            description,
            link: 'https://equitygroupfoundation.com/programmes/wings-to-fly',
            dates: {
                deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
            },
            funding: {
                amount: 0,
                amountDisplay: 'Full Scholarship — tuition, upkeep, and materials',
                fundingType: 'Full',
                coversTuition: true,
                coversUpkeep: true,
                coversMaterials: true,
                renewable: true
            },
            application: {
                method: 'Online',
                documentsRequired: [
                    'KCSE Certificate',
                    'National ID',
                    'Admission Letter',
                    'Passport Photo',
                    'Bank Statement or Proof of Financial Need'
                ],
                hasDirectApply: true,
                applicationSteps: 'Apply through Equity Group Foundation website or nearest Equity Bank branch'
            },
            eligibility: {
                mtiBand: 'Vulnerable',
                mtiScoreMin: 0,
                mtiScoreMax: 40,
                minGPA: 0,
                yearOfStudy: [1],
                courseOfStudy: ['All'],
                university: ['All'],
                county: 'All',
                gender: 'All',
                nationality: 'Kenyan',
                ageMin: 18,
                ageMax: 25,
                disability: null
            },
            source: 'Scraped',
            sourceUrl: 'https://equitygroupfoundation.com/programmes/wings-to-fly',
            isVerified: true,
            isActive: true,
            lastScrapedAt: new Date()
        };

        await Scholarship.updateOne(
            { title: scholarship.title, provider: scholarship.provider },
            { $set: scholarship },
            { upsert: true }
        );

        console.log('Equity Wings to Fly: 1 scholarship saved');
        return 1;

    } catch(error) {
        console.error('Equity scraper error:', error.message);
        return 0;
    }
}