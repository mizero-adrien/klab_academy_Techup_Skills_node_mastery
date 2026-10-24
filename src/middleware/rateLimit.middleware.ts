import rateLimit from "express-rate-limit";

const MINUTE = 60 * 1000;

type LimiterOptions = {
  windowMinutes: number;
  limit: number;
  message: string;
  // true = only failed requests (status 400 and above) count toward the limit
  onlyFailures?: boolean;
};

const createLimiter = ({ windowMinutes, limit, message, onlyFailures = false }: LimiterOptions) =>
  rateLimit({
    windowMs: windowMinutes * MINUTE,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: onlyFailures,
    // Our frontend reads { message }, so the 429 uses the same shape as every other error
    message: { message },
  });

export const apiLimiter = createLimiter({
  windowMinutes: 15,
  limit: 300,
  message: "Too many requests. Please slow down and try again in a few minutes.",
});

// Only wrong passwords count, so a real customer signing in normally is never blocked
export const loginLimiter = createLimiter({
  windowMinutes: 120,
  limit: 10,
  onlyFailures: true,
  message: "Too many failed sign-in attempts. Please try again in 2 hours.",
});

export const registerLimiter = createLimiter({
  windowMinutes: 60,
  limit: 20,
  message: "Too many accounts created from this network. Please try again later.",
});

// Every request sends an email, and Brevo's free plan allows only 300 per day
export const forgotPasswordLimiter = createLimiter({
  windowMinutes: 60,
  limit: 5,
  message: "Too many reset requests. Please try again in an hour.",
});

export const resetPasswordLimiter = createLimiter({
  windowMinutes: 120,
  limit: 10,
  message: "Too many attempts. Please try again in 2 hours.",
});
