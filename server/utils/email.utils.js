import transporter from '../config/email.config.js';

//Sending a Deadline Email Remainder
export const sendDeadlineReminder = async (studentEmail, studentName, scholarshipRouter, daysLeft)=> {

    try{

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to:studentEmail,
            subject: `Deadline Reminder: ${scholarship.title} - ${daysLeft} days left`,
            html:`

                <div style="font-family: Arial, sans-serif; maxwidth: 600px; margin: 0-auto;">
                    <h2 style="color:#2E86AB;">UniSave Sacco - Deadline Reminder</h2>

                    <p>Dear ${studentName},</p>
                    
                    <p>This is a reminder that the following scholarship deadline is approaching:<p>

                    <div style="background: #f5f5f5; padding: 15px; border-radius:8px;">
                        <h3 style="color: #333;">${sholarship.title}</h3>
                        <p><strong>Provider:<strong> ${scholarship.provider}</p>
                        <p><strong>Deadline: <strong> ${new Date(scholarship.date.deadline).toDateString()}</p>
                        <p><strong>Days Left: </strong> ${daysLeft} days
                        <p><strong>Amount: <strong> ${scholarship.funding.amountDisplayed || 'See link'}</p>
                    </div>

                    <br/>

                    <a href = "${sholarship.link}
                        style ="background: #2E86AB; color: white; padding: 10px 20px; 
                              text-decoration: none; border-radius: 5px;">
                        Apply Now
                    </a>

                    <br/><br/>
                    <p style="color:#8888; font-size:12px;">
                        This is an automated reminder for UniSave Sacco.
                        Do not reply to this email.
                    </p>
                </div>
            `
        });
        console.log(`Reminder sent to ${studentEmail} for ${scholarship.title}`)

    }catch(error){

        console.error(`Failed to send email to ${studentEmail}: `, error.message);

    }
}

//Welcome Email
export const sendWelcomeEmail = async(studentEmail, studentName)=>{
    try{

        await transporter.sendEmail({
            from: process.env.EMAIL_FROM,
            to: studentEmail,
            subject: `Welcome to UniSave Sacco`,
            html:`
            
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2E86AB;">Welcome to UniSave Sacco!</h2>
                    
                    <p>Dear ${studentName},</p>
                    
                    <p>Your account has been approved. You can now:</p>
                    
                    <ul>
                        <li>Complete your profile</li>
                        <li>Browse available scholarships</li>
                        <li>Get matched to scholarships based on your profile</li>
                        <li>Track your applications</li>
                    </ul>

                    <p>Good luck with your applications!</p>
                    
                    <p style="color: #888; font-size: 12px;">
                        UniSave Sacco Team
                    </p>
                </div>
            `
        });

        console.log(`Welcome email sent to ${studentEmail}`)

    }catch(error){

        console.error(`Failed to send the email: `, error.message);
    }
}