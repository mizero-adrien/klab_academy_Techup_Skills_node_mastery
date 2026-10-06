export const welcomeEmailTemplate = (name: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">

              <tr>
                <td style="background-color: #1e40af; padding: 32px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Welcome, ${name}!</h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 32px; color: #333333; font-size: 16px; line-height: 1.6;">
                  <p style="margin: 0 0 16px;">Hi ${name},</p>
                  <p style="margin: 0 0 16px;">Thank you for registering with TechUpSkills. Your account is ready to use.</p>
                  <p style="margin: 0;">Happy shopping!</p>
                </td>
              </tr>

              <tr>
                <td style="background-color: #f8fafc; padding: 16px 32px; text-align: center; color: #999999; font-size: 12px;">
                  <p style="margin: 0;">&copy; ${new Date().getFullYear()} TechUpSkills. All rights reserved.</p>
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