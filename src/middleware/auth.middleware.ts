import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

type TokenPayload = { id: string; role: string; iat: number };

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  let decoded: TokenPayload;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    const user = await User.findById(decoded.id).select("role passwordChangedAt");

    if (!user) {
      return res.status(401).json({ message: "This account no longer exists" });
    }

    // iat is in whole seconds, so compare in seconds. A token issued in the same
    // second as the change (for example the sign-in right after a reset) stays valid.
    if (
      user.passwordChangedAt &&
      Math.floor(user.passwordChangedAt.getTime() / 1000) > decoded.iat
    ) {
      return res
        .status(401)
        .json({ message: "Your password was changed. Please sign in again." });
    }

    // The role comes from the database, not from the token, so it is always current
    req.user = { id: String(user._id), role: user.role };
    next();
  } catch (error) {
    console.error("Auth lookup failed:", error);
    res.status(500).json({ message: "Could not verify your session. Please try again." });
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
