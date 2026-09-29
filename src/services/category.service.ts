import { Category, ICategory } from "../models/category.model";

export const createCategory = async (data: {
  name: string;
  description?: string;
}): Promise<ICategory> => {
  const category = new Category(data);
  return category.save();
};

export const getAllCategories = async (): Promise<ICategory[]> => {
  return Category.find();
};

export const getCategoryById = async (
  id: string
): Promise<ICategory | null> => {
  return Category.findById(id);
};

export const updateCategory = async (
  id: string,
  data: { name?: string; description?: string }
): Promise<ICategory | null> => {
  return Category.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCategory = async (id: string): Promise<ICategory | null> => {
  return Category.findByIdAndDelete(id);
};