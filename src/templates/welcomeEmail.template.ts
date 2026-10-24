import { APP_NAME, getFrontendUrl } from "../config/app";
import { escapeHtml } from "../utils/escapeHtml";
import { emailButton, emailLayout } from "./emailLayout";

const ACCENT = "#16a34a";

export const welcomeEmailTemplate = (name: string): string => {
  return emailLayout({
    title: `Welcome to ${APP_NAME}`,
    accent: ACCENT,
    preheader: "Your account is ready. Start shopping today.",
    bodyHtml: `
      <p style="margin: 0 0 16px;">Hi ${escapeHtml(name)},</p>
      <p style="margin: 0 0 24px;">Thanks for creating an account with ${escapeHtml(APP_NAME)}. Your account is ready — browse our latest products and enjoy a smooth checkout.</p>

      ${emailButton(`${getFrontendUrl()}/products`, "Start shopping", ACCENT)}

      <p style="margin: 0; color: #666666; font-size: 14px;">If you didn't create this account, you can safely ignore this email.</p>
    `,
  });
};
