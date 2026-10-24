import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User, IUser } from "../models/user.model";
import { sendEmail } from "../utils/sendEmail";
import { welcomeEmailTemplate } from "../templates/welcomeEmail.template";
import { passwordResetTemplate, passwordResetText } from "../templates/passwordReset.template";
import { APP_NAME, getFrontendUrl } from "../config/app";

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<IUser> => {
  const user = new User(data);
  await user.save();

  const html = welcomeEmailTemplate(user.name);
  sendEmail(user.email, `Welcome to ${APP_NAME}`, html).catch((error) => {
    console.error("Welcome email failed but registration succeeded:", error);
  });

  return user;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string; user: IUser } | null> => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return null;

  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: "7d",
  });

  return { token, user };
};

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });

  // Always behave the same whether or not the account exists,
  // so this endpoint cannot be used to discover registered emails.
  if (!user) {
    return;
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await user.save();

  const resetUrl = `${getFrontendUrl()}/reset-password/${rawToken}`;
  const html = passwordResetTemplate(user.name, resetUrl);
  const text = passwordResetText(user.name, resetUrl);

  if (process.env.NODE_ENV !== "production") {
    console.log("Reset link (development only):", resetUrl);
  }

  sendEmail(user.email, `Reset your ${APP_NAME} password`, html, text).catch((error) => {
    console.error("Password reset email failed:", error);
  });
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<boolean> => {
  const user = await User.findOne({
    resetPasswordToken: hashToken(token),
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    return false;
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return true;
};
