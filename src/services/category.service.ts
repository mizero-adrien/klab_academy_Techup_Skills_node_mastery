import { Category, ICategory } from "../models/category.model";
import { Product } from "../models/product.model";

export const createCategory = async (data: {
  name: string;
  description?: string;
  imageUrl?: string;
}): Promise<ICategory> => {
  const category = new Category(data);
  return category.save();
};

export const getAllCategories = async (): Promise<ICategory[]> => {
  const categories = await Category.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "category",
        as: "products",
      },
    },
    {
      $addFields: {
        productCount: { $size: "$products" },
      },
    },
    {
      $project: {
        products: 0,
      },
    },
  ]);
  return categories as unknown as ICategory[];
};

export const getCategoryById = async (
  id: string
): Promise<ICategory | null> => {
  return Category.findById(id);
};

export const updateCategory = async (
  id: string,
  data: { name?: string; description?: string; imageUrl?: string }
): Promise<ICategory | null> => {
  return Category.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCategory = async (id: string): Promise<ICategory | null> => {
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    const error = new Error(
      `This category still has ${productCount} product${productCount === 1 ? "" : "s"}. Move or delete them first.`
    ) as any;
    error.code = "CATEGORY_HAS_PRODUCTS";
    throw error;
  }
  return Category.findByIdAndDelete(id);
};