
import type { TopicFormValues, TopicType } from "./topic.types";

export const TOPIC_CONFIG = {
  endpoint: "/api/topics",
  queryKey: ["topics"] as const,
  pageSize: 20,
  searchDebounce: 500,
  defaultSortBy: "createdAt",
  defaultOrder: "desc" as const,
};

export const TOPIC_TYPES: TopicType[] = [
  "Talk",
  "Debate",
  "Panel Discussion",
];

export const TOPIC_FORM_DEFAULTS: TopicFormValues = {
  sessionId: "",
  topicName: "",
  startTime: "",
  endTime: "",
  topicType: "Talk",
  facultyId: [],
  moderatorId: [],
  panelistId: [],
  expertPanelistId: [],
};

export const TOPIC_SORT_OPTIONS = [
  { label: "Recently Created", value: "createdAt" },
  { label: "Topic Name", value: "topicName" },
  { label: "Start Time", value: "startTime" },
  { label: "End Time", value: "endTime" },
  { label: "Topic Type", value: "topicType" },
  { label: "Last Updated", value: "updatedAt" },
] as const;
