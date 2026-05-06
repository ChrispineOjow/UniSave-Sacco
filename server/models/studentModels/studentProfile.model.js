import mongoose from 'mongoose';

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
    MTI_Score:{
        type: Number,
        required: true
    },
    phoneNumber:{
        type: String,
        required: true,
        unique: true
    }
    
},  { timestamps: true})

const StudentProfile = mongoose.model('student_profile', studentProfileSchema);
export default StudentProfile;