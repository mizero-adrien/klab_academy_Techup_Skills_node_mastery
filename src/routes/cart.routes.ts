import { Router } from "express";
import {
  getCartHandler,
  addItemHandler,
  updateItemHandler,
  removeItemHandler,
} from "../controllers/cart.controller";
import { protect } from "../middleware/auth.middleware";
import { validateBody, validateIdParam } from "../middleware/validate.middleware";
import { addToCartSchema, updateCartItemSchema } from "../schemas/cart.schema";

const router = Router();

router.use(protect);

router.get("/", getCartHandler);
router.post("/", validateBody(addToCartSchema), addItemHandler);
router.put(
  "/:productId",
  validateIdParam("productId"),
  validateBody(updateCartItemSchema),
  updateItemHandler
);
router.delete("/:productId", validateIdParam("productId"), removeItemHandler);

export default router;