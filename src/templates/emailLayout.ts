import { APP_NAME } from "../config/app";
import { escapeHtml } from "../utils/escapeHtml";

type EmailLayoutOptions = {
  title: string;
  accent: string;
  preheader?: string;
  bodyHtml: string;
};

export const emailButton = (href: string, label: string, accent: string): string => {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px;">
      <tr>
        <td style="background-color: ${accent}; border-radius: 6px;">
          <a href="${escapeHtml(href)}" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: bold; font-family: Arial, sans-serif;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `;
};

export const emailLayout = ({
  title,
  accent,
  preheader,
  bodyHtml,
}: EmailLayoutOptions): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${escapeHtml(title)}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
      ${
        preheader
          ? `<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">${escapeHtml(preheader)}</div>`
          : ""
      }
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">

              <tr>
                <td style="background-color: ${accent}; padding: 32px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px;">${escapeHtml(title)}</h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 32px; color: #333333; font-size: 16px; line-height: 1.6;">
                  ${bodyHtml}
                </td>
              </tr>

              <tr>
                <td style="background-color: #f8fafc; padding: 16px 32px; text-align: center; color: #999999; font-size: 12px;">
                  <p style="margin: 0;">&copy; ${new Date().getFullYear()} ${escapeHtml(APP_NAME)}. All rights reserved.</p>
                  <p style="margin: 4px 0 0;">This is an automated message, please do not reply.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
