import { Request, Response } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/category.service";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

export const createCategoryHandler = async (req: Request, res: Response) => {
  try {
    let imageUrl: string | undefined;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "techupskills-categories");
    }

    const category = await createCategory({ ...req.body, imageUrl });
    res.status(201).json(category);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A category with this name already exists" });
    }
    res.status(400).json({ message: "Failed to create category" });
  }
};

export const listCategoriesHandler = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

export const getCategoryHandler = async (req: Request, res: Response) => {
  try {
    const category = await getCategoryById(String(req.params.id));
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category" });
  }
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
  try {
    const updateData: { name?: string; description?: string; imageUrl?: string } = {
      ...req.body,
    };

    if (req.file) {
      updateData.imageUrl = await uploadToCloudinary(req.file.buffer, "techupskills-categories");
    }

    const hasUpdates = Object.values(updateData).some((value) => value !== undefined);
    if (!hasUpdates) {
      return res.status(400).json({
        message: "Validation Failed",
        errors: [{ field: "body", message: "provide at least one field to update" }],
      });
    }

    const category = await updateCategory(String(req.params.id), updateData);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A category with this name already exists" });
    }
    res.status(400).json({ message: "Failed to update category" });
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  try {
    const category = await deleteCategory(String(req.params.id));
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(204).send();
  } catch (error: any) {
    if (error.code === "CATEGORY_HAS_PRODUCTS") {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to delete category" });
  }
};