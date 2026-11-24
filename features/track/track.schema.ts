import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Please select a valid option.");

export const trackSchema = z.object({
  trackName: z
    .string()
    .trim()
    .min(2, "Track name must contain at least 2 characters.")
    .max(100, "Track name cannot exceed 100 characters."),

  status: z.enum(["Active", "Inactive"], {
    error: "Please select a status.",
  }),

  // Optional on the backend: an empty array is valid.
  trackLeaderIds: z.array(objectIdSchema),
});

export type TrackFormValues = z.infer<typeof trackSchema>;
