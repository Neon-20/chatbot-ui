import { Tables } from "@/supabase/types"

export const basePrompts: Tables<"prompts">[] = [
  {
    content:
      "Compose a formal email requesting a project update. Ensure to mention the deadline and the expected deliverables.",
    created_at: "2024-09-27T10:15:00Z",
    folder_id: "1",
    id: "101",
    name: "Request Project Update",
    sharing: "private",
    updated_at: null,
    user_id: ""
  },
  {
    content:
      "Write a formal email to schedule a meeting with the client. Mention possible dates and time slots for their convenience.",
    created_at: "2024-09-27T10:20:00Z",
    folder_id: "1",
    id: "102",
    name: "Schedule Client Meeting",
    sharing: "private",
    updated_at: null,
    user_id: ""
  },
  {
    content:
      "Summarize the attached report into a concise executive summary. Focus on key insights, metrics, and actionable recommendations.",
    created_at: "2024-09-27T10:25:00Z",
    folder_id: "2",
    id: "201",
    name: "Summarize Report",
    sharing: "private",
    updated_at: null,
    user_id: ""
  },
  {
    content:
      "Provide a summary of the latest customer feedback from multiple sources. Focus on common themes, pain points, and improvement areas.",
    created_at: "2024-09-27T10:30:00Z",
    folder_id: "2",
    id: "202",
    name: "Summarize Customer Feedback",
    sharing: "private",
    updated_at: null,
    user_id: ""
  }
]

export const baseFolders: Tables<"folders">[] = [
  {
    created_at: "2024-09-27T09:00:00Z",
    description: "Folder for storing prompts related to email writing tasks.",
    id: "1",
    name: "email",
    type: "prompts",
    updated_at: null,
    user_id: "",
    workspace_id: ""
  },
  {
    created_at: "2024-09-27T09:05:00Z",
    description:
      "Folder for storing prompts related to summarizing data and documents.",
    id: "2",
    name: "summarize",
    type: "prompts",
    updated_at: null,
    user_id: "",
    workspace_id: ""
  }
]
