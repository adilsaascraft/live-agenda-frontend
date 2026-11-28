
import { z } from "zod";

import { TOPIC_TYPES } from "./topic.config";

const timeRegex = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i;

export const topicSchema = z.object({
  sessionId: z.string().min(1, "Please select a session."),

  topicName: z
    .string()
    .trim()
    .min(2, "Topic name must contain at least 2 characters.")
    .max(1000, "Topic name cannot exceed 1000 characters."),

  startTime: z
    .string()
    .trim()
    .regex(timeRegex, "Enter a valid time, e.g. 10:30 AM."),

  endTime: z
    .string()
    .trim()
    .regex(timeRegex, "Enter a valid time, e.g. 11:00 AM."),

  topicType: z.enum(TOPIC_TYPES),

  facultyId: z.array(z.string()),
  moderatorId: z.array(z.string()),
  panelistId: z.array(z.string()),
  expertPanelistId: z.array(z.string()),
});

export type TopicFormValues = z.infer<typeof topicSchema>;
