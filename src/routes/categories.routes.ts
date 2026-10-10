import { Router } from "express";
import {
  createCategoryHandler,
  listCategoriesHandler,
  getCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from "../controllers/category.controller";

import { protect, adminOnly } from "../middleware/auth.middleware";
import { validateBody, validateIdParam } from "../middleware/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "../schemas/category.schema";

const router = Router();

router.get("/", listCategoriesHandler);
router.get("/:id", getCategoryHandler);

router.post("/",protect, adminOnly, validateBody(createCategorySchema), createCategoryHandler);
router.put("/:id",protect, adminOnly, validateBody(updateCategorySchema), updateCategoryHandler);
router.delete("/:id",protect, adminOnly, validateIdParam("id"), deleteCategoryHandler);

export default router;