import "dotenv/config";

export const APP_NAME = process.env.APP_NAME?.trim() || "TechupMart";

const DEV_FRONTEND_URL = "http://localhost:5173";

export const getFrontendUrl = (): string => {
  const configured = process.env.FRONTEND_URL?.trim();

  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("FRONTEND_URL is not set");
  }

  return DEV_FRONTEND_URL;
};
