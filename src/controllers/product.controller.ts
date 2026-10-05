import { Request, Response } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";


export const createProductHandler = async (req: Request, res: Response) => {
  try {
    let imageUrl: string | undefined;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const product = await createProduct({ ...req.body, imageUrl });
    res.status(201).json(product);
  } catch (error: any) {
    console.error("Create product error:", error);
    res.status(400).json({ message: "Failed to create product", error: error.message });
  }
};

export const listProductsHandler = async (req: Request, res: Response) => {
  const categoryId = req.query.category ? String(req.query.category) : undefined;
  const products = await getAllProducts(categoryId);
  res.json(products);
};

export const getProductHandler = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const product = await getProductById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
};

export const updateProductHandler = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  try {
    let updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const product = await updateProduct(id, updateData);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Failed to update product", error });
  }
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const product = await deleteProduct(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(204).send();
};