import { Router } from "express";
import {
  createProductHandler,
  listProductsHandler,
  getProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from "../controllers/product.controller";

const router = Router();

router.post("/", createProductHandler);
router.get("/", listProductsHandler);
router.get("/:id", getProductHandler);
router.put("/:id", updateProductHandler);
router.delete("/:id", deleteProductHandler);

export default router;