import { z } from "zod";

export const facultySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must contain at least 2 characters.")
    .max(100, "Full name cannot exceed 100 characters."),

  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address.")
    .max(254, "Email cannot exceed 254 characters."),

  mobile: z
    .string()
    .trim()
    .min(1, "Mobile number is required."),
});

export type FacultyFormValues = z.infer<typeof facultySchema>;