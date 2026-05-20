import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }
);

transporter.verify((error, success)=>{
    if(error){
        console.error('Email service Error:', error.message)
    }else{
        console.log("Email service ready")
    }
})

export default transporter;