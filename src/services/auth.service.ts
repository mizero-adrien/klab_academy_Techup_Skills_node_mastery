import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<IUser> => {
  const user = new User(data);
  return user.save();
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