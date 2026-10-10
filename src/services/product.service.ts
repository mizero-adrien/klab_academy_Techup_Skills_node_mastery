//full CRUD + population

import { Product, IProduct } from "../models/product.model";
import { Category } from "../models/category.model";

export const createProduct = async (data: {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  category: string;
  imageUrl?: string;
}): Promise<IProduct> => {
  const categoryExists = await Category.exists({ _id: data.category });
  if (!categoryExists) {
    throw new Error("Category not found");
  }

  const product = new Product(data);
  return product.save();
};

export const getAllProducts = async (categoryId?: string): Promise<IProduct[]> => {
  const filter = categoryId ? { category: categoryId } : {};
  return Product.find(filter).populate("category");
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  return Product.findById(id).populate("category");
};

export const updateProduct = async (
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
  }>
): Promise<IProduct | null> => {
  if (data.category) {
    const categoryExists = await Category.exists({ _id: data.category });
    if (!categoryExists) {
      throw new Error("Category not found");
    }
  }

  return Product.findByIdAndUpdate(id, data, { new: true }).populate("category");
};

export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return Product.findByIdAndDelete(id);
};