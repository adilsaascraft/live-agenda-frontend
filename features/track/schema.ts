import { z } from "zod";

export const trackSchema = z.object({
  trackName: z
    .string()
    .trim()
    .min(1, "Track name is required"),

  status: z.enum(["Active", "Inactive"]),
});