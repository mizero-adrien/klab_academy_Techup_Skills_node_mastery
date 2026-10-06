import {Router} from "express";
import {registerHandler, loginHandler} from "../controllers/auth.controller";
import { forgotPasswordHandler, resetPasswordHandler } from "../controllers/auth.controller";

const router = Router();

router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.post('/forgot-password', forgotPasswordHandler);
router.post('/reset-password/:token', resetPasswordHandler);

export default router;