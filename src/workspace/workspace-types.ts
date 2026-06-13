export type Workspace = {
  id: string;
  name: string;
  color: string;
  model: "auto" | "groq" | "gemini";
};

export type RecentChat = {
  id: string;
  title: string;
  time: string;
};

export type Memory = {
  id: string;
  text: string;
  category: "fact" | "preference" | "decision" | "goal" | "people" | "project";
  date: string;
  source: string;
  pinned?: boolean;
};

export type Decision = {
  id: string;
  text: string;
  workspace: string;
  status: "Pending" | "Implemented" | "Abandoned" | "In progress";
  source: string;
  date: string;
};
