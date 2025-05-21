"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { Search, Edit, Trash2, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { UserDialog } from "@/components/user-dialog"
import type { UserDto } from "@/types/auth"

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null)

  // Mock data for demonstration
  const [users, setUsers] = useState<UserDto[]>([
    {
      id: 1,
      username: "admin",
      fullName: "Admin User",
      email: "admin@example.com",
      phoneNumber: "+94712345678",
      role: "ADMIN",
      active: true,
    },
    {
      id: 2,
      username: "cashier1",
      fullName: "John Cashier",
      email: "john@example.com",
      phoneNumber: "+94723456789",
      role: "CASHIER",
      active: true,
    },
    {
      id: 3,
      username: "manager1",
      fullName: "Jane Manager",
      email: "jane@example.com",
      phoneNumber: "+94734567890",
      role: "MANAGER",
      active: true,
    },
    {
      id: 4,
      username: "owner",
      fullName: "Store Owner",
      email: "owner@example.com",
      phoneNumber: "+94745678901",
      role: "OWNER",
      active: true,
    },
    {
      id: 5,
      username: "cashier2",
      fullName: "Robert Cashier",
      email: "robert@example.com",
      phoneNumber: "+94756789012",
      role: "CASHIER",
      active: false,
    },
  ])

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEdit = (user: UserDto | null) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const handleSaveUser = (user: UserDto) => {
    if (user.id) {
      // Update existing user
      setUsers(users.map((u) => (u.id === user.id ? user : u)))
    } else {
      // Add new user
      const newUser = {
        ...user,
        id: Math.max(...users.map((u) => u.id || 0)) + 1,
        active: true,
      }
      setUsers([...users, newUser])
    }
    setIsDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage user accounts and permissions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => handleAddEdit(null)} className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "ADMIN"
                              ? "default"
                              : user.role === "OWNER"
                                ? "destructive"
                                : user.role === "MANAGER"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.active ? "default" : "secondary"}>
                          {user.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleAddEdit(user)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id!)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      <UserDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} user={selectedUser} onSave={handleSaveUser} />
    </Card>
  )
}
