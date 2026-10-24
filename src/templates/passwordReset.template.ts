import { APP_NAME } from "../config/app";
import { escapeHtml } from "../utils/escapeHtml";
import { emailButton, emailLayout } from "./emailLayout";

const ACCENT = "#dc2626";

export const passwordResetTemplate = (name: string, resetUrl: string): string => {
  return emailLayout({
    title: "Password Reset Request",
    accent: ACCENT,
    preheader: "Choose a new password. This link expires in 15 minutes.",
    bodyHtml: `
      <p style="margin: 0 0 16px;">Hi ${escapeHtml(name)},</p>
      <p style="margin: 0 0 24px;">We received a request to reset your ${escapeHtml(APP_NAME)} password. Click the button below to choose a new one. This link expires in 15 minutes.</p>

      ${emailButton(resetUrl, "Reset Password", ACCENT)}

      <p style="margin: 0 0 16px; color: #666666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="margin: 0 0 24px; color: #666666; font-size: 13px; word-break: break-all;">${escapeHtml(resetUrl)}</p>

      <p style="margin: 0; color: #666666; font-size: 14px;">If you didn't request this, you can safely ignore this email — your password will remain unchanged.</p>
    `,
  });
};

export const passwordResetText = (name: string, resetUrl: string): string => {
  return [
    `Hi ${name},`,
    "",
    `We received a request to reset your ${APP_NAME} password. Open this link to choose a new one:`,
    resetUrl,
    "",
    "This link expires in 15 minutes.",
    "",
    "If you didn't request this, you can safely ignore this email — your password will remain unchanged.",
  ].join("\n");
};
