import { Router } from "express";
import {
  createProductHandler,
  listProductsHandler,
  getProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from "../controllers/product.controller";
import { protect, adminOnly } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { validateBody, validateIdParam } from "../middleware/validate.middleware";
import { createProductSchema, updateProductSchema } from "../schemas/product.schema";

const router = Router();

router.get("/", listProductsHandler);
router.get("/:id", getProductHandler);

router.post("/", 
  protect, 
  adminOnly, 
  upload.single("image"),
  validateBody(createProductSchema),
  createProductHandler);

router.put("/:id",protect, adminOnly, upload.single("image"), validateBody(updateProductSchema), updateProductHandler);
router.delete("/:id", protect, adminOnly,validateIdParam("id"), deleteProductHandler);

export default router;