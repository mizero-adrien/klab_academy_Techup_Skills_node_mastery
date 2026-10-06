import { transporter } from "../config/mailer";

export const sendEmail =  async (to: string, subject: string, html: string): Promise<void> => {
    try{
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });
        console.log(`Email sent succesfully to ${to}`);
    } catch (error) {
        console.error("Failed to send email to ${to}:", error);
        throw error;
    }
};
   

