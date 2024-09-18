"use client"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
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
  TableRow,
  TableFooter
} from "@/components/ui/table"
import { TablesUpdate } from "@/supabase/types"
import { supabase } from "@/lib/supabase/browser-client"
import { Button } from "./ui/button"
import { IconCrown } from "@tabler/icons-react"
import { getAllProfiles } from "@/db/profile"
import { Input } from "./ui/input"

type Role = "user" | "developer" | "admin"

const AdminRolesPage = () => {
  const [profileList, setProfileList] = useState<TablesUpdate<"profiles">[]>([])
  const [inputValue, setInputValue] = useState("")
  const [filteredProfileList, setFilteredProfileList] = useState<
    TablesUpdate<"profiles">[]
  >([])

  useEffect(() => {
    async function fetchProfiles() {
      const profiles = await getAllProfiles()
      setProfileList(profiles)
    }
    fetchProfiles()
  }, [])

  useEffect(() => {
    setFilteredProfileList(
      profileList.filter(
        user =>
          user.username?.toLowerCase().includes(inputValue.toLowerCase()) ||
          user.display_name?.toLowerCase().includes(inputValue.toLowerCase())
      )
    )
  }, [inputValue, profileList])

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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  }

  const totalAdmins = filteredProfileList.filter(
    user => user.roles === "admin"
  ).length
  const totalUsers = filteredProfileList.filter(
    user => user.roles === "user"
  ).length

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
        <div className="max-h-[95vh] overflow-y-auto">
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Search users..."
            className="m-2"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfileList.map(user => (
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
                        <SelectItem value="user">User 👨🏻</SelectItem>
                        <SelectItem value="developer">Developer 👨🏻‍💻</SelectItem>
                        <SelectItem value="admin">Admin 👑</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at!!)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-background">
              <TableRow>
                <TableCell colSpan={4} className="text-center text-red-400">
                  Total Admins: {totalAdmins} | Total Users: {totalUsers}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AdminRolesPage
