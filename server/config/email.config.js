import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport(
    {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        family: 4
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