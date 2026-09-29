import { Request, Response } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service";

export const createProductHandler = async (req: Request, res: Response) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Failed to create product", error });
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
  const product = await updateProduct(id, req.body);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const product = await deleteProduct(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(204).send();
};