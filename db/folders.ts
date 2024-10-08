import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export const getFoldersByWorkspaceId = async (workspaceId: string) => {
  const { data: superadmin, error: superadminError } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("roles", "superadmin")
    .single()

  if (superadminError) {
    throw new Error("Error fetching superadmin:" + superadminError.message)
  } else {
    const superadminUserId = superadmin?.user_id

    const { data: folders, error: foldersError } = await supabase
      .from("folders")
      .select("*")
      .or(`workspace_id.eq.${workspaceId},user_id.eq.${superadminUserId}`)

    if (foldersError) {
      throw new Error("Error fetching folders:" + foldersError.message)
    }

    return folders
  }
}

export const createFolder = async (folder: TablesInsert<"folders">) => {
  const { data: createdFolder, error } = await supabase
    .from("folders")
    .insert([folder])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdFolder
}

export const updateFolder = async (
  folderId: string,
  folder: TablesUpdate<"folders">
) => {
  const { data: updatedFolder, error } = await supabase
    .from("folders")
    .update(folder)
    .eq("id", folderId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedFolder
}

export const deleteFolder = async (folderId: string) => {
  const { error } = await supabase.from("folders").delete().eq("id", folderId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}
