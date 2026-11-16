
export type TopicType = "Talk" | "Debate" | "Panel Discussion";

export interface TopicFaculty {
  _id: string;
  fullName: string;
  email: string;
  mobile: string
}

export interface TopicSession {
  _id: string;
  sessionName: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  chairperson?: TopicFaculty[];
}

export type TopicReference<T> = T | string | null;

export interface Topic {
  _id: string;
  sessionId: TopicReference<TopicSession>;
  topicName: string;
  startTime: string;
  endTime: string;
  topicType: TopicType;
  facultyId: TopicReference<TopicFaculty>[];
  moderatorId: TopicReference<TopicFaculty>[];
  panelistId: TopicReference<TopicFaculty>[];
  expertPanelistId: TopicReference<TopicFaculty>[];
  createdAt: string;
  updatedAt: string;
}

export interface TopicPayload {
  sessionId: string;
  topicName: string;
  startTime: string;
  endTime: string;
  topicType: TopicType;
  facultyId: string[];
  moderatorId: string[];
  panelistId: string[];
  expertPanelistId: string[];
}

export type CreateTopicPayload = TopicPayload;
export type UpdateTopicPayload = TopicPayload;

export interface TopicPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  from: number;
  to: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface TopicListResponse {
  success: boolean;
  message: string;
  data: {
    topics: Topic[];
  };
  pagination: TopicPagination;
}

export interface TopicListParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface TopicListOptionsResponse {
  success: boolean;
  message: string;
  data: {
    topics: Topic[];
  };
}

export interface TopicSessionsResponse {
  success: boolean;
  message: string;
  data: {
    sessions: TopicSession[];
  };
}

export interface TopicFacultiesResponse {
  success: boolean;
  message: string;
  data: {
    faculties: TopicFaculty[];
  };
}

export interface TopicFormValues {
  sessionId: string;
  topicName: string;
  startTime: string;
  endTime: string;
  topicType: TopicType;
  facultyId: string[];
  moderatorId: string[];
  panelistId: string[];
  expertPanelistId: string[];
}
