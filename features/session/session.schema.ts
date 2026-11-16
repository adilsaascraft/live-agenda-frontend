
import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Please select a valid option.");

const timeSchema = z
  .string()
  .trim()
  .regex(
    /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i,
    "Enter time in format 10:00 AM.",
  );

export const sessionSchema = z.object({
  sessionName: z
    .string()
    .trim()
    .min(2, "Session name must contain at least 2 characters.")
    .max(100, "Session name cannot exceed 100 characters."),

  hallId: objectIdSchema,

  trackId: objectIdSchema,

  sessionDate: z
    .date({
      error: "Please select a session date.",
    })
    .refine(
      (date) => !Number.isNaN(date.getTime()),
      "Please select a valid session date.",
    ),

  startTime: timeSchema,

  endTime: timeSchema,

  chairperson: z
    .array(objectIdSchema)
    .min(1, "Select at least one chairperson."),
});

export type SessionFormValues = z.infer<typeof sessionSchema>;
