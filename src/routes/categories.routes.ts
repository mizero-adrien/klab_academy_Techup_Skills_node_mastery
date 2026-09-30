import { Router } from "express";
import {
  createCategoryHandler,
  listCategoriesHandler,
  getCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from "../controllers/category.controller";

import { protect, adminOnly } from "../middleware/auth.middleware";

const router = Router();

router.post("/",protect, adminOnly, createCategoryHandler);
router.get("/", listCategoriesHandler);
router.get("/:id", getCategoryHandler);
router.put("/:id",protect, adminOnly, updateCategoryHandler);
router.delete("/:id",protect, adminOnly, deleteCategoryHandler);

export default router;