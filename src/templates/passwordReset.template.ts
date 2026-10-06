export const passwordResetTemplate = (name: string, resetUrl: string): string => {
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
                <td style="background-color: #dc2626; padding: 32px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Password Reset Request</h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 32px; color: #333333; font-size: 16px; line-height: 1.6;">
                  <p style="margin: 0 0 16px;">Hi ${name},</p>
                  <p style="margin: 0 0 24px;">We received a request to reset your password. Click the button below to choose a new one. This link expires in 15 minutes.</p>

                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px;">
                    <tr>
                      <td style="background-color: #dc2626; border-radius: 6px;">
                        <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: bold;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; color: #666666; font-size: 14px;">If you didn't request this, you can safely ignore this email — your password will remain unchanged.</p>
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