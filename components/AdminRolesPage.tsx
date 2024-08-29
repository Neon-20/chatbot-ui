"use client"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { TablesUpdate } from "@/supabase/types"
import { supabase } from "@/lib/supabase/browser-client"
import { Button } from "./ui/button"
import { IconCrown } from "@tabler/icons-react"
import { getAllProfiles } from "@/db/profile"

type Role = "user" | "developer" | "admin"

const AdminRolesPage = () => {
  const [profileList, setProfileList] = useState<TablesUpdate<"profiles">[]>([])

  useEffect(() => {
    async function fetchProfiles() {
      const profiles = await getAllProfiles()
      setProfileList(profiles)
    }
    fetchProfiles()
  }, [])

  const handleRoleChange = async (username: string, newRole: Role) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ roles: newRole })
        .eq("username", username)

      if (error) throw error

      setProfileList(
        profileList.map(user =>
          user.username === username ? { ...user, roles: newRole } : user
        )
      )

      console.log("Role updated successfully")
    } catch (error) {
      console.error("Error updating role:", error)
    }
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"}>
          <IconCrown size={28} />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="min-w-fit">
        <SheetHeader>
          <SheetTitle>Admin Role Management</SheetTitle>
        </SheetHeader>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Display Name</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profileList.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Select
                      value={user.roles}
                      onValueChange={(value: Role) =>
                        handleRoleChange(user.username!, value)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AdminRolesPage
