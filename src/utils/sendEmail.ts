import client from "../config/mailer";
import { APP_NAME } from "../config/app";

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<void> => {
  const senderEmail = process.env.EMAIL_FROM?.trim();

  if (!senderEmail) {
    throw new Error("EMAIL_FROM is not configured");
  }

  await client.transactionalEmails.sendTransacEmail({
    sender: { email: senderEmail, name: APP_NAME },
    to: [{ email: to }],
    subject,
    htmlContent: html,
    ...(text ? { textContent: text } : {}),
  });

  console.log(`Email "${subject}" sent`);
};
