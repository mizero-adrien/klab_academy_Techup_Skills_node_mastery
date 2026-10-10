import { z } from "zod";

const categoryNameField = z
    .string("category name is required")
    .trim()
    .min(2, "category name must be at least 2 characters")
    .max(50, "category name must be at most 50 characters");

const categoryDescriptionField  = z
    .string("description must be text")
    .trim()
    .max(500, "description must be at most 500 characters");

export const createCategorySchema = z.object({
    name: categoryNameField,
    description: categoryDescriptionField.optional(),
});

export const updateCategorySchema = z.object({
    name: categoryNameField.optional(),
    description: categoryDescriptionField.optional(),
})
.refine((data) => Object.keys(data).length > 0, {
    message: "provide at least one field to update",
    path: ["body"],
});