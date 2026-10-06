import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User, IUser } from "../models/user.model";
// import { transporter } from "../config/mailer";
import { sendEmail } from "../utils/sendEmail";
import { welcomeEmailTemplate } from "../templates/welcomeEmail.template";
import { passwordResetTemplate } from "../templates/passwordReset.template";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<IUser> => {
  const user = new User(data);
  await user.save();

  const html = welcomeEmailTemplate(user.name);
  sendEmail(user.email, " welcome to techUp shop", html). catch((error)=> {
    console.error("welcome email failed but registration succeeded:", error);
  })
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

  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const resetUrl = `http://localhost:1000/auth/reset-password/${resetToken}`;
  const html = passwordResetTemplate(user.name, resetUrl);

  sendEmail(user.email, "Reset Your Password", html).catch((error) => {
    console.error("Password reset email failed:", error);
  });
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<boolean> => {

  const user = await User.findOne({
    resetPasswordToken: token,
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