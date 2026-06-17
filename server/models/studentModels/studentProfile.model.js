import mongoose from 'mongoose';
import {getMTIBand} from '../../utils/mti.utils.js';


const studentProfileSchema = new mongoose.Schema({
    studentAuthId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student_auth',
        required: true,
        unique: true
    },
    nationalId:{
        type: String,
        unique: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    surName:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        enum: ['Male', 'Female'],
        required:true
    },
    disability:{
        type: Boolean,
        default: false
    },
    age:{
        type:Number,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    university:{
        type: String,
        required: true
    },
    course:{
        type: String,
        required: true
    },
    schoolRegistrationNumber:{
        type: String,
        required: true,
        unique: true
    },
    gpa:{
        type: Number,
        required: true,
        min:0,
        max:4.0
    },
    county:{
        type:String,
        required:true
    },
    constituency:{
        type: String,
    },
    MTI_Score:{
        type: Number,
        required: true
    },
    MTI_Band:{
        type: String,
        enum: ['Vulnerable', 'Extremely Needy', 'Needy', 'Less Needy'],
        required: true
    },
    yearOfStudy:{
        type: Number,
        enum: [1,2,3,4,5,6],
        required:true
    },
    phoneNumber:{
        type: String,
        required: true,
        unique: true
    }
    
},  { timestamps: true})


studentProfileSchema.pre('validate', function(next){
    if(this.MTI_Score !== undefined){
        this.MTI_Band = getMTIBand(this.MTI_Score);
    }

});

const StudentProfile = mongoose.model('student_profile', studentProfileSchema);
export default StudentProfile;