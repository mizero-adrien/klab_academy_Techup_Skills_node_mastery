import { Router } from "express";
import {
  getCartHandler,
  addItemHandler,
  updateItemHandler,
  removeItemHandler,
} from "../controllers/cart.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.get("/", getCartHandler);
router.post("/", addItemHandler);
router.put("/:productId", updateItemHandler);
router.delete("/:productId", removeItemHandler);

export default router;