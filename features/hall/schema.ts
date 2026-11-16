import { z } from "zod";

export const hallSchema = z.object({
  hallName: z
    .string()
    .trim()
    .min(1, "Hall name is required"),

  status: z.enum(["Active", "Inactive"]),
});