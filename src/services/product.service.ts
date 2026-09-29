//full CRUD + population

import {Product, IProduct} from '../models/product.model';

export const createProduct = async (data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    category: string; // Accept category ID as a string
}) : Promise<IProduct> => {
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
  }>
): Promise<IProduct | null> => {
  return Product.findByIdAndUpdate(id, data, { new: true }).populate("category");
};

export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return Product.findByIdAndDelete(id);
};
