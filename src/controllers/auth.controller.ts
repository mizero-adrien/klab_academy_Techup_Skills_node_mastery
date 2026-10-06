import { Request, Response } from "express";
import { registerUser, loginUser, forgotPassword, resetPassword } from "../services/auth.service";

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(400).json({ message: "Registration failed", error });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);

  if (!result) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    token: result.token,
    user: {
      id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
    },
  });
};

export const forgotPasswordHandler  =  async (req: Request, res: Response) =>{
  const { email } = req.body;
  try {
    await forgotPassword(email);
    res.json({ message: "If an account with that email exists, a password reset link has been sent."});
  } catch (error){
    res.status(500).json({ message: " something went wrong!",error});
  }
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  
  const token = String(req.params.token);
  const { password } = req.body;


  try {
    const success = await resetPassword(token, password);

    if (!success) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    res.json({ message: "Password has been reset successfully" });
  } catch (error: any) {
    
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};