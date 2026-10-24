import { Router } from "express";
import {
  createOrderHandler,
  listOrdersHandler,
  getOrderHandler,
  cancelOrderHandler,
  listAllOrdersHandler,
  getOrderAdminHandler,
  updateOrderStatusHandler,
} from "../controllers/order.controller";
import { protect, adminOnly } from "../middleware/auth.middleware";
import { validateBody, validateIdParam } from "../middleware/validate.middleware";
import { createOrderSchema, updateOrderStatusSchema } from "../schemas/order.schema";

const router = Router();

router.use(protect);

// Admin routes (declared before /:id so "admin" is not treated as an order id)
router.get("/admin/all", adminOnly, listAllOrdersHandler);
router.get("/admin/:id", adminOnly, validateIdParam("id"), getOrderAdminHandler);
router.patch("/admin/:id/status", adminOnly, validateIdParam("id"), validateBody(updateOrderStatusSchema), updateOrderStatusHandler);

// Customer routes
router.post("/", validateBody(createOrderSchema), createOrderHandler);
router.get("/", listOrdersHandler);
router.get("/:id", validateIdParam("id"), getOrderHandler);
router.patch("/:id/cancel", validateIdParam("id"), cancelOrderHandler);

export default router;