import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

const client = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY as string,
});

export default client;