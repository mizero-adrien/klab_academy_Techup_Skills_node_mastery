import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

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