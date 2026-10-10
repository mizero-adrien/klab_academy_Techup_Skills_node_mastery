import { z } from "zod";

const nameField = z
  .string("Name is required")
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be at most 50 characters");

const emailField = z
  .string("Email is required")
  .trim()
  .toLowerCase()
  .email("Enter a valid email address");

const newPasswordField = z
  .string("Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const registerSchema = z.object({
  name: nameField,
  email: emailField,
  password: newPasswordField,
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string("Password is required").min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z.object({
  password: newPasswordField,
});