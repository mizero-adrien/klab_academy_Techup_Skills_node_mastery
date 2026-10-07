import client from "../config/mailer";

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    await client.transactionalEmails.sendTransacEmail({
      sender: { email: process.env.EMAIL_FROM as string },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
};

