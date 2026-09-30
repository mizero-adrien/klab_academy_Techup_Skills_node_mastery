import { Router } from "express";
import {
  checkoutHandler,
  listOrdersHandler,
  getOrderHandler,
  cancelOrderHandler,
} from "../controllers/order.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.post("/checkout", checkoutHandler);
router.get("/", listOrdersHandler);
router.get("/:id", getOrderHandler);
router.patch("/:id/cancel", cancelOrderHandler);

export default router;