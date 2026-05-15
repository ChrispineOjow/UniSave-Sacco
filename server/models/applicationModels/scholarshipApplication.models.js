import mongoose from 'mongoose';

const scholarshipApplicationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student_profile',
        required:true
    },
    scholarshipId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'scholarship',
        required: true
    },
    status:{
        type:String,
        enum: ['Saved', 'Approved', 'Pending', 'Applied', 'Rejected' ],
        default: 'Saved'
    },
    appliedAt:{
        type:Date,
        defualt: null
    },
    notes: {
        type: String,
        defualt: null
    }

}, {timestamps: true});

scholarshipApplicationSchema.index({studentId: 1, scholarshipId: 1}, {unique: true});

const ScholarshipApplication = mongoose.model('scholarshipApplication', scholarshipApplicationSchema);

export default ScholarshipApplication;