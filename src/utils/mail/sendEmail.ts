import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

export const sendEmail = async(email: string, ens: string, amount: string) => {

    try {
        const transporter = nodemailer.createTransport({
            host: "smtppro.zoho.com",
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
    
        const rewardEmail = {
            from: `Rewards @ susu.club <${process.env.USER}>`,
            to: email, // Dynamic recipient email address
            subject: 'susu club reward',
            html: `
                <p>Dear ${ens},</p>

                <p>Congratulations! A reward of <strong>$${amount}</strong> has been credited to your Susu Box in recognition of your loyal saving habits.</p>

                <p>There's nothing you need to do. Whenever you have a moment, feel free to check your balance. We appreciate your dedication, and as always, stay safe!</p>

                <p>Warm regards,<br/>susu.club</p>
            `,
        };
        await transporter.sendMail(rewardEmail);
    } catch (error) {
        console.log(error)
    }

}



