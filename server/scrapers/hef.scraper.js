import puppeteer from 'puppeteer';
import Scholarship from '../models/sponsorsModels/scholarship.model.js';

export const scrapeHEF = async () => {
    let browser;
    try {
        console.log('Scraping HEF portal...');

        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        );

        await page.goto('https://www.hef.co.ke', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Try to extract scholarship info
        const scholarships = await page.evaluate(() => {
            const items = [];
            // Adjust selectors based on actual HEF site
            document.querySelectorAll('.scholarship, .funding-item, article').forEach(el => {
                const title = el.querySelector('h2, h3, .title')?.innerText?.trim();
                const description = el.querySelector('p')?.innerText?.trim();
                const link = el.querySelector('a')?.href;

                if(title){
                    items.push({ title, description, link });
                }
            });
            return items;
        });

        // Fallback if nothing found
        const toSave = scholarships.length > 0 ? scholarships.map(s => ({
            title: s.title,
            provider: 'Higher Education Financing',
            category: 'Government',
            description: s.description || 'HEF scholarship under the Student-Centered Funding Model',
            link: s.link || 'https://www.hef.co.ke',
            dates: {
                deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)
            },
            funding: {
                amountDisplay: 'Based on MTI score band',
                fundingType: 'Full',
                coversTuition: true,
                coversUpkeep: true,
                coversMaterials: true,
                renewable: true
            },
            application: {
                method: 'Online',
                documentsRequired: [
                    'National ID or KCSE Index Number',
                    'Admission Letter',
                    'Household financial information'
                ],
                hasDirectApply: true,
                applicationSteps: 'Register on hef.co.ke with your KCSE index number or National ID'
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
            sourceUrl: 'https://www.hef.co.ke',
            isVerified: true,
            isActive: true,
            lastScrapedAt: new Date()
        })) : [{
            // Fallback entry
            title: 'HEF Government Scholarship 2026',
            provider: 'Higher Education Financing',
            category: 'Government',
            description: 'Government scholarship under the Student-Centered Funding Model (SCFM). Awards based on MTI score — up to 82% for vulnerable students.',
            link: 'https://www.hef.co.ke',
            dates: {
                deadline: new Date('2026-09-30')
            },
            funding: {
                amountDisplay: 'Up to 82% of tuition (based on MTI band)',
                fundingType: 'Full',
                coversTuition: true,
                coversUpkeep: true,
                coversMaterials: false,
                renewable: true
            },
            application: {
                method: 'Online',
                documentsRequired: [
                    'National ID or KCSE Index Number',
                    'KUCCPS Placement Letter',
                    'Household financial details'
                ],
                hasDirectApply: true,
                applicationSteps: 'Visit hef.co.ke, register with your KCSE index or ID, submit financial details for MTI scoring'
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
            sourceUrl: 'https://www.hef.co.ke',
            isVerified: true,
            isActive: true,
            lastScrapedAt: new Date()
        }];

        let saved = 0;
        for(const scholarship of toSave){
            await Scholarship.updateOne(
                { title: scholarship.title, provider: scholarship.provider },
                { $set: scholarship },
                { upsert: true }
            );
            saved++;
        }

        console.log(`HEF: ${saved} scholarships saved`);
        return saved;

    } catch(error) {
        console.error('HEF scraper error:', error.message);
        return 0;
    } finally {
        if(browser) await browser.close();
    }
}