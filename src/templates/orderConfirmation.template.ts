export const orderConfirmationTemplate = (
  name: string,
  orderId: string,
  totalAmount: number
): string => {
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
                <td style="background-color: #16a34a; padding: 32px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Order Confirmed!</h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 32px; color: #333333; font-size: 16px; line-height: 1.6;">
                  <p style="margin: 0 0 16px;">Hi ${name},</p>
                  <p style="margin: 0 0 24px;">Thank you for your order. Here are the details:</p>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 8px 0; color: #666666;">Order ID</td>
                      <td style="padding: 8px 0; color: #333333; font-weight: bold; text-align: right;">${orderId}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666666;">Total Amount</td>
                      <td style="padding: 8px 0; color: #333333; font-weight: bold; text-align: right;">$${totalAmount.toFixed(2)}</td>
                    </tr>
                  </table>

                  <p style="margin: 0;">We'll notify you once your order ships.</p>
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