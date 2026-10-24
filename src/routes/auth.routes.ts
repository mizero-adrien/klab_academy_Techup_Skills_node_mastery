import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} from "../controllers/auth.controller";
import { validateBody } from "../middleware/validate.middleware";
import {
  forgotPasswordLimiter,
  loginLimiter,
  registerLimiter,
  resetPasswordLimiter,
} from "../middleware/rateLimit.middleware";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema";

const router = Router();

router.post("/register", registerLimiter, validateBody(registerSchema), registerHandler);
router.post("/login", loginLimiter, validateBody(loginSchema), loginHandler);
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validateBody(forgotPasswordSchema),
  forgotPasswordHandler
);
router.post(
  "/reset-password/:token",
  resetPasswordLimiter,
  validateBody(resetPasswordSchema),
  resetPasswordHandler
);

export default router;
