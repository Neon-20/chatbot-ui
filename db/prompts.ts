import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export const getPromptById = async (promptId: string) => {
  const { data: prompt, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", promptId)
    .single()

  if (!prompt) {
    throw new Error(error.message)
  }

  return prompt
}

export const getPromptWorkspacesByWorkspaceId = async (workspaceId: string) => {
  // Step 1: Fetch the superadmin's user_id
  const { data: superadmin, error: superadminError } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("roles", "superadmin")
    .single()

  if (superadminError) {
    throw new Error(`Error fetching superadmin: ${superadminError.message}`)
  }

  const superadminUserId = superadmin?.user_id

  // Step 2: Fetch the workspace and include prompts from both the specific workspaceId and superadmin's workspace
  const { data: workspaces, error: workspacesError } = await supabase
    .from("workspaces")
    .select(
      `
      id,
      name,
      prompts (*)
    `
    )
    .or(`id.eq.${workspaceId},user_id.eq.${superadminUserId}`)

  if (workspacesError) {
    throw new Error(`Error fetching workspace: ${workspacesError.message}`)
  }

  if (!workspaces || workspaces.length === 0) {
    throw new Error("No workspaces found.")
  }

  return workspaces[0] // Return all matching workspaces
}

export const getPromptWorkspacesByPromptId = async (promptId: string) => {
  const { data: prompt, error } = await supabase
    .from("prompts")
    .select(
      `
      id, 
      name, 
      workspaces (*)
    `
    )
    .eq("id", promptId)
    .single()

  if (!prompt) {
    throw new Error(error.message)
  }
  return prompt
}

export const createPrompt = async (
  prompt: TablesInsert<"prompts">,
  workspace_id: string
) => {
  const { data: createdPrompt, error } = await supabase
    .from("prompts")
    .insert([prompt])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  await createPromptWorkspace({
    user_id: createdPrompt.user_id,
    prompt_id: createdPrompt.id,
    workspace_id
  })

  return createdPrompt
}

export const createPrompts = async (
  prompts: TablesInsert<"prompts">[],
  workspace_id: string
) => {
  const { data: createdPrompts, error } = await supabase
    .from("prompts")
    .insert(prompts)
    .select("*")

  if (error) {
    throw new Error(error.message)
  }

  await createPromptWorkspaces(
    createdPrompts.map(prompt => ({
      user_id: prompt.user_id,
      prompt_id: prompt.id,
      workspace_id
    }))
  )

  return createdPrompts
}

export const createPromptWorkspace = async (item: {
  user_id: string
  prompt_id: string
  workspace_id: string
}) => {
  const { data: createdPromptWorkspace, error } = await supabase
    .from("prompt_workspaces")
    .insert([item])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdPromptWorkspace
}

export const createPromptWorkspaces = async (
  items: { user_id: string; prompt_id: string; workspace_id: string }[]
) => {
  const { data: createdPromptWorkspaces, error } = await supabase
    .from("prompt_workspaces")
    .insert(items)
    .select("*")

  if (error) throw new Error(error.message)

  return createdPromptWorkspaces
}

export const updatePrompt = async (
  promptId: string,
  prompt: TablesUpdate<"prompts">
) => {
  const { data: updatedPrompt, error } = await supabase
    .from("prompts")
    .update(prompt)
    .eq("id", promptId)
    .select("*")
    .single()

  if (error) {
    console.error(error.message)
  }

  return updatedPrompt
}

export const deletePrompt = async (promptId: string) => {
  const { error } = await supabase.from("prompts").delete().eq("id", promptId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const deletePromptWorkspace = async (
  promptId: string,
  workspaceId: string
) => {
  const { error } = await supabase
    .from("prompt_workspaces")
    .delete()
    .eq("prompt_id", promptId)
    .eq("workspace_id", workspaceId)

  if (error) throw new Error(error.message)

  return true
}
