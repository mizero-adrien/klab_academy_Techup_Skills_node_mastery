import { Router } from "express";
import {
  createCategoryHandler,
  listCategoriesHandler,
  getCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from "../controllers/category.controller";

import { protect, adminOnly } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { validateBody, validateIdParam } from "../middleware/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "../schemas/category.schema";

const router = Router();

router.get("/", listCategoriesHandler);
router.get("/:id", validateIdParam("id"), getCategoryHandler);

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  validateBody(createCategorySchema),
  createCategoryHandler
);
router.put("/:id", protect, adminOnly, upload.single("image"), validateIdParam("id"), validateBody(updateCategorySchema), updateCategoryHandler);
router.delete("/:id", protect, adminOnly, validateIdParam("id"), deleteCategoryHandler);

export default router;