import { APP_NAME, getFrontendUrl } from "../config/app";
import { escapeHtml } from "../utils/escapeHtml";
import { emailButton, emailLayout } from "./emailLayout";

const ACCENT = "#16a34a";

const PAYMENT_LABELS: Record<string, string> = {
  momo: "Mobile Money (MoMo)",
  cash: "Cash on delivery",
};

const formatRwf = (amount: number): string => `Rwf ${amount.toLocaleString("en-US")}`;

export type OrderConfirmationItem = {
  productName: string;
  quantity: number;
  priceAtPurchase: number;
};

export type OrderConfirmationData = {
  name: string;
  orderId: string;
  items: OrderConfirmationItem[];
  totalAmount: number;
  delivery: {
    address: string;
    city: string;
    phone: string;
  };
  paymentMethod: string;
};

export const orderConfirmationTemplate = ({
  name,
  orderId,
  items,
  totalAmount,
  delivery,
  paymentMethod,
}: OrderConfirmationData): string => {
  const reference = orderId.slice(-8).toUpperCase();

  const itemRows = items
    .map((item) => {
      const lineTotal = item.priceAtPurchase * item.quantity;
      return `
        <tr>
          <td style="padding: 8px 0; color: #333333;">${escapeHtml(item.productName)} <span style="color: #666666;">× ${item.quantity}</span></td>
          <td style="padding: 8px 0; color: #333333; font-weight: bold; text-align: right;">${formatRwf(lineTotal)}</td>
        </tr>
      `;
    })
    .join("");

  return emailLayout({
    title: "Order Confirmed!",
    accent: ACCENT,
    preheader: `Order ${reference} is confirmed. We'll notify you once it ships.`,
    bodyHtml: `
      <p style="margin: 0 0 16px;">Hi ${escapeHtml(name)},</p>
      <p style="margin: 0 0 24px;">Thank you for your order. Here are the details:</p>

      <p style="margin: 0 0 8px; color: #666666; font-size: 14px;">Order reference</p>
      <p style="margin: 0 0 24px; font-size: 20px; font-weight: bold; letter-spacing: 1px;">${escapeHtml(reference)}</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px; border-top: 1px solid #e2e8f0;">
        ${itemRows}
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border-top: 1px solid #e2e8f0;">
        <tr>
          <td style="padding: 12px 0 0; color: #333333; font-weight: bold;">Total</td>
          <td style="padding: 12px 0 0; color: #333333; font-weight: bold; text-align: right;">${formatRwf(totalAmount)}</td>
        </tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
        <tr>
          <td style="padding: 4px 0; color: #666666; vertical-align: top;">Delivery</td>
          <td style="padding: 4px 0; color: #333333; text-align: right;">
            ${escapeHtml(delivery.address)}, ${escapeHtml(delivery.city)}<br />
            ${escapeHtml(delivery.phone)}
          </td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #666666;">Payment</td>
          <td style="padding: 4px 0; color: #333333; text-align: right;">${escapeHtml(PAYMENT_LABELS[paymentMethod] ?? paymentMethod)}</td>
        </tr>
      </table>

      ${emailButton(`${getFrontendUrl()}/account`, "View my orders", ACCENT)}

      <p style="margin: 0; color: #666666; font-size: 14px;">We'll notify you once your order ships. Thanks for shopping with ${escapeHtml(APP_NAME)}.</p>
    `,
  });
};
