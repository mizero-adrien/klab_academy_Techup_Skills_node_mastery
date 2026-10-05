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

const router = Router();

router.post("/", protect, adminOnly, upload.single("image"), createProductHandler);
router.get("/", listProductsHandler);
router.get("/:id", getProductHandler);
router.put("/:id",protect, adminOnly, upload.single("image"), updateProductHandler);
router.delete("/:id", protect, adminOnly, deleteProductHandler);

export default router;