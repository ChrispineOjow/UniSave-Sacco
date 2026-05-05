import mongoose from 'mongoose';

const studentAuthSchema = new mongoose.Schema({

    nationalId:{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true,
        minLength: 6,

    },
    accountStatus:{
        type:String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true});

//Auto update email in student profile, when email in student auth is updated
studentAuthSchema.post('findOneAndUpdate', async function(doc){
    if(doc){
        await mongoose.model('student_profile').findOneAndUpdate(
            { studentAuthId: doc._id},
            {email: doc.email}
        );
    }
});

const StudentAuth = mongoose.model('student_auth', studentAuthSchema);

export default StudentAuth;