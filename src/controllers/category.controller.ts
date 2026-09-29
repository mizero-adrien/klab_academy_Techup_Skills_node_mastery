import { Request, Response } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/category.service";

export const createCategoryHandler = async (req: Request, res: Response) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: "Failed to create category", error });
  }
};

export const listCategoriesHandler = async (req: Request, res: Response) => {
  const categories = await getAllCategories();
  res.json(categories);
};

export const getCategoryHandler = async (req: Request, res: Response) => {
  const category = await getCategoryById(String(req.params.id));
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.json(category);
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
  const category = await updateCategory(String(req.params.id), req.body);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.json(category);
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  const category = await deleteCategory(String(req.params.id));
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.status(204).send();
};