import {Router} from "express";
import {registerHandler, loginHandler} from "../controllers/auth.controller";
import { forgotPasswordHandler, resetPasswordHandler } from "../controllers/auth.controller";
import { validateBody } from "../middleware/validate.middleware";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../schemas/auth.schema";

const router = Router();

router.post('/register', validateBody(registerSchema), registerHandler);
router.post('/login', validateBody(loginSchema), loginHandler);
router.post('/forgot-password', validateBody(forgotPasswordSchema), forgotPasswordHandler);
router.post('/reset-password/:token', validateBody(resetPasswordSchema), resetPasswordHandler);

export default router;