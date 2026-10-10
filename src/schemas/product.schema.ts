import { z } from "zod";

const formNumber = (label: string) =>
  z
    .string(`${label} is required`)
    .trim()
    .min(1, `${label} is required`)
    .pipe(z.coerce.number(`${label} must be a number`));

const name = z
  .string("Name is required")
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be at most 100 characters");

const description = z
  .string("Description must be text")
  .trim()
  .max(1000, "Description must be at most 1000 characters");

const price = formNumber("Price").pipe(
  z.number().min(0, "Price cannot be negative")
);

const stock = formNumber("Stock").pipe(
  z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
);

const category = z
  .string("Category is required")
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Category must be a valid ID");

export const createProductSchema = z.object({
  name,
  description: description.optional(),
  price,
  stock: stock.optional(),
  category,
});

export const updateProductSchema = z.object({
  name: name.optional(),
  description: description.optional(),
  price: price.optional(),
  stock: stock.optional(),
  category: category.optional(),
});