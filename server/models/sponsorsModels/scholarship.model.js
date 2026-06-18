import mongoose from 'mongoose';

const ScholarshipsSchema = new mongoose.Schema({
    title: { type:String,required: true},
    provider:{type:String,required:true},
    category:{
        type:String,
        enum: ['Government', 'NGO', 'County', 'University','Corporate'],
        required:true
    },
    description:{type: String},
    link:{type:String, required:true},
    logoUrl:{type:String},

    //Eligibility 
    eligibility:{
        mtiBand:{
            type:String,
            enum: ['Vulnerable', 'Extremely Needy', 'Needy', 'Less Needy', 'All'],
            default: 'All'
        },
        mtiScoreMin: {type: Number, default:0},
        mtiScoreMax: {type: Number, default:100},
        minGPA: {type: Number, default: null},
        
        yearOfStudy: {type:[Number], default: [1,2,3,4,5,6]},
        courseOfStudy: {type:[String], default:['All']},
        university: {type: [String], default:['All']},
        nationality: {type: String, default: 'Kenyan'},
        county: {type: String, default: 'All'},
        constituency: {type: String, default: 'All'},
        gender: {type: String, enum:['Male', 'Female', 'All'], default: 'All'},
        disability: {type: Boolean, default: null},
        ageMin: {type: Number, default: 18},
        ageMax: {type: Number, default:35}

    },

    //Funding details
    funding:{
        amount: {type: Number},
        amountDisplay: {type: String},
        coversTuition: {type: Boolean, default: false},
        coversUpKeep: {type: Boolean, default:false},
        coversMaterials: {type: Boolean, default: false},
        fundingType:{
            type: String,
            enum: ['Full', 'Partial', 'Loan', 'Bursary', 'Grant']
        },
        renewable: {type: Boolean, default: false}
    },

    // Dates
    dates: {
        openingDate: {type: Date},
        deadline: {type: Date, required: true},
        announcementDate: {type: Date},
        academicYear: {type: String}
    },
    isActive: {type:Boolean, default: true},


    //Application details
    application:{
        method:{
            type: String,
            enum: ['Online', 'Physical', 'Both'],
            default: 'Online'
        },
        documentsRequired: {type:[String], default: []},
        hasDirectlyApply: {type: Boolean, default: true},
        applicationSteps: {type:String}
    },

    //Admin & System
    source: {
        type: String,
        enum: ['Scraped', 'Manual', 'API','Self-Registered'],
        default: 'Scraped'
    },
    sourceUrl: {type:String},
    isVerified: {type: Boolean, default: false},
    isActive: {type:Boolean, default: true},
    isFeatured: {type: Boolean, default: false},
    lastScrapedAt:{type: Date}

}, {timestamps:true});

//Indexing for faster notifications
ScholarshipsSchema.index({'dates.deadline': 1});

//Indexing category and eligibility for faster matching
ScholarshipsSchema.index({'category': 1, 'eligibility.mtiBand': 1});

const Scholarship = mongoose.model('scholarship', ScholarshipsSchema);
export default Scholarship;