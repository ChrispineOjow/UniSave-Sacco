import Scholarship from '../models/sponsorsModels/scholarship.model.js';

// NG-CDF bursaries are mostly physical/offline
// The ones added here are the ones we looked for
export const scrapeNGCDF = async () => {
    try {
        console.log('Adding NG-CDF bursaries...');

        const bursaries = [
            {
                title: 'NG-CDF University Bursary — Nairobi',
                provider: 'National Government CDF — Nairobi Constituencies',
                category: 'Government',
                description: 'University bursary for students from Nairobi constituencies through the National Government Constituencies Development Fund',
                link: 'https://ngcdf.go.ke',
                county: 'Nairobi'
            },
            {
                title: 'NG-CDF University Bursary — Mombasa',
                provider: 'National Government CDF — Mombasa Constituencies',
                category: 'Government',
                description: 'University bursary for students from Mombasa constituencies',
                link: 'https://ngcdf.go.ke',
                county: 'Mombasa'
            },
            {
                title: 'NG-CDF University Bursary — Kisumu',
                provider: 'National Government CDF — Kisumu Constituencies',
                category: 'Government',
                description: 'University bursary for students from Kisumu constituencies',
                link: 'https://ngcdf.go.ke',
                county: 'Kisumu'
            },
            {
                title: 'NG-CDF University Bursary — Nakuru',
                provider: 'National Government CDF — Nakuru Constituencies',
                category: 'Government',
                description: 'University bursary for students from Nakuru constituencies',
                link: 'https://ngcdf.go.ke',
                county: 'Nakuru'
            }
        ];

        let saved = 0;
        for(const bursary of bursaries){
            const scholarship = {
                title: bursary.title,
                provider: bursary.provider,
                category: bursary.category,
                description: bursary.description,
                link: bursary.link,
                dates: {
                    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                },
                funding: {
                    amount: 20000,
                    amountDisplay: 'Up to KES 20,000',
                    fundingType: 'Bursary',
                    coversTuition: true,
                    coversUpkeep: false,
                    coversMaterials: false,
                    renewable: true
                },
                application: {
                    method: 'Physical',
                    documentsRequired: [
                        'National ID',
                        'Admission Letter',
                        'Fee Structure',
                        'Parents/Guardian ID',
                        'Recommendation Letter from Chief'
                    ],
                    hasDirectApply: false,
                    applicationSteps: 'Visit your local NG-CDF office or constituency office with required documents'
                },
                eligibility: {
                    mtiBand: 'All',
                    mtiScoreMin: 0,
                    mtiScoreMax: 100,
                    yearOfStudy: [1, 2, 3, 4, 5, 6],
                    courseOfStudy: ['All'],
                    university: ['All'],
                    county: bursary.county,
                    gender: 'All',
                    nationality: 'Kenyan',
                    ageMin: 18,
                    ageMax: 35,
                    disability: null
                },
                source: 'Manual',
                sourceUrl: 'https://ngcdf.go.ke',
                isVerified: true,
                isActive: true,
                lastScrapedAt: new Date()
            };

            await Scholarship.updateOne(
                { title: scholarship.title, provider: scholarship.provider },
                { $set: scholarship },
                { upsert: true }
            );
            saved++;
        }

        console.log(`NG-CDF: ${saved} bursaries saved`);
        return saved;

    } catch(error) {
        console.error('NG-CDF scraper error:', error.message);
        return 0;
    }
}