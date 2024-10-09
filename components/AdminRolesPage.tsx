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
import { ArrowUpDown } from "lucide-react"

type Role = "user" | "developer" | "admin" | "superadmin"

const AdminRolesPage = () => {
  const [profileList, setProfileList] = useState<TablesUpdate<"profiles">[]>([])
  const [inputValue, setInputValue] = useState("")
  const [filteredProfileList, setFilteredProfileList] = useState<
    TablesUpdate<"profiles">[]
  >([])
  const [sortOrder, setSortOrder] = useState<{
    created_at: "asc" | "desc"
    updated_at: "asc" | "desc"
  }>({ created_at: "asc", updated_at: "asc" })
  const [sortBy, setSortBy] = useState<"created_at" | "updated_at">(
    "created_at"
  )

  useEffect(() => {
    async function fetchProfiles() {
      let profiles = await getAllProfiles()
      profiles.map(profile => {
        if (!profile.updated_at) {
          profile.updated_at = profile.created_at
        }
      })
      setProfileList(profiles)
    }
    fetchProfiles()
  }, [])

  useEffect(() => {
    let sortedList = [...profileList].filter(
      user =>
        user.username?.toLowerCase().includes(inputValue.toLowerCase()) ||
        user.display_name?.toLowerCase().includes(inputValue.toLowerCase())
    )
    sortedList = sortedList.sort((a, b) => {
      const dateA = new Date(a[sortBy] ?? "").getTime()
      const dateB = new Date(b[sortBy] ?? "").getTime()
      return sortOrder[sortBy] === "asc" ? dateA - dateB : dateB - dateA
    })

    setFilteredProfileList(sortedList)
  }, [inputValue, profileList, sortOrder, sortBy])

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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return undefined
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  }

  const toggleSortOrder = (column: "created_at" | "updated_at") => {
    setSortBy(column)
    setSortOrder(prev => ({
      ...prev,
      [column]: prev[column] === "asc" ? "desc" : "asc"
    }))
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
            className="my-2"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>
                  <Button
                    className="gap-3"
                    variant="ghost"
                    onClick={() => toggleSortOrder("created_at")}
                  >
                    Date Joined <ArrowUpDown size={18} />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="gap-3"
                    onClick={() => toggleSortOrder("updated_at")}
                  >
                    Last Login <ArrowUpDown size={18} />
                  </Button>
                </TableHead>
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
                        <SelectItem value="superadmin">
                          Super Admin 👑👑
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at ?? "")}</TableCell>
                  <TableCell>{formatDate(user.updated_at ?? "")}</TableCell>
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
