import { z } from "zod";

export const objectId = (label: string) =>
  z
    .string(`${label} is required`)
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, `${label} must be a valid ID`);