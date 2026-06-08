import axios from 'axios';
import * as cheerio from 'cheerio';
import Scholarship from '../models/sponsorsModels/scholarship.model.js';

export const scrapeHELB = async () => {
    try{

        console.log('Scrapping Helb....');

        const {data} = await axios.get('https://www.helb.co.ke/loans-bursaries',{
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'

            },
            timeout: 10000
        });

        const $ = cheerio.load(data);
        const scholarships = [];

        //Adjust the selector based on actual HELB site structure
        $('.lon-item, .bursary-item, .scholarship-item').each((i, el)=> {
            const title = $(el).find('h3, h2, .title').text().trim();
            const description = $(el).find('p, .description').first().text().trim();
            const link = $(el).find('a').attr('href') || 'https://www.helb.co.ke';
            const deadline = $(el).find('.deadline, .date').text().trim();

            if(title){
                scholarships.push({
                    title: title || 'HELB Loan/Bursary',
                    provider: 'Higher Education Loans Board',
                    category: 'Government',
                    description: description || 'Government loan/bursary for Kenyan University Students',
                    link: link.startsWith('http')? link: `https://www.helb.co.ke${link}`,
                    dates: {
                        deadline: deadline 
                        ? new Date(deadline)
                        :new Date(Date.now()+ 90* 24 * 60 * 60 * 1000) // Default to 3 months from now
                    },
                    funding: {
                        amountDisplay: "Check HELB portal",
                        fundingType: 'Loan',
                        coversTuition:true,
                        coversUpKeep: true,
                        renewable:true,
                        coversMaterials:false
                    },
                    application: {
                        method: 'Online',
                        documetnsRequired: [
                            'National ID',
                            'Admission Letter',
                            'Bank Statement',
                            'Parents/Gaurdian ID',
                        ],
                        hasDirectApply: true
                    },
                    eligibility: {
                        mtiBand: 'All',
                        mtiScoreMin: 0,
                        mtiScoreMax: 100,
                        yearOfStudy: [1, 2, 3, 4, 5, 6],
                        courseOfStudy: ['All'],
                        university: ['All'],
                        county: 'All',
                        gender: 'All',
                        nationality: 'Kenyan',
                        ageMin: 18,
                        ageMax: 35
                    },
                    source: 'Scraped',
                    sourceUrl: 'https://www.helb.co.ke',
                    isVerified: true,
                    isActive: true,
                    lastScrapedAt: new Date()
                });

            }
        });

        // Fall back
        if(scholarships.length === 0){
            console.log('HELB scraper found no items - using fallback');
            scholarships.push({
                title: 'HELB Undergrraduate Loan',
                provider: 'Higher Education Loans Board',
                category: 'Government',
                description: 'Government loan for Kenyan undergraduate students in public universities',
                link: 'https://www.helb.co.ke',
                dates: {
                    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                },
                funding: {
                    amount: 60000,
                    amountDisplay: 'Up to KES 60,000',
                    fundingType: 'Loan',
                    coversTuition: true,
                    coversUpkeep: true,
                    coversMaterials: false,
                    renewable: true
                },
                 application: {
                    method: 'Online',
                    documentsRequired: [
                        'National ID',
                        'Admission Letter',
                        'Bank Statement',
                        'Parents/Guardian ID'
                    ],
                    hasDirectApply: true,
                    applicationSteps: 'Visit helb.co.ke, register with your ID number, fill in financial details and submit'
                },
                eligibility: {
                    mtiBand: 'All',
                    mtiScoreMin: 0,
                    mtiScoreMax: 100,
                    yearOfStudy: [1, 2, 3, 4, 5, 6],
                    courseOfStudy: ['All'],
                    university: ['All'],
                    county: 'All',
                    gender: 'All',
                    nationality: 'Kenyan',
                    ageMin: 18,
                    ageMax: 35
                },
                source: 'Scraped',
                sourceUrl: 'https://www.helb.co.ke',
                isVerified: true,
                isActive: true,
                lastScrapedAt: new Date()
            });
        }

        //Save in the datbase - upsert to avoid duplicates
        let saved = 0;
        for(const scholarship of scholarships){
            await Scholarship.updateOne(
                {title: scholarship.title, provider: scholarship.provider},
                {$set: scholarship},
                {upsert: true}
            );
            saved++;
        }

        console.log(`HELB: ${saved} scholarships saved`);
        return saved;
    }catch(error){

        console.error(' HELB scraper error: ', error.message);
        return 0;

    }
}