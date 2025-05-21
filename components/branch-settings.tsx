"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { BranchDialog } from "@/components/branch-dialog"
import type { BranchDto } from "@/types/branch"

export function BranchSettings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<BranchDto | null>(null)

  // Mock data for demonstration
  const [branches, setBranches] = useState<BranchDto[]>([
    {
      id: 1,
      name: "Main Branch",
      location: "123 Main Street, City, Country",
    },
    {
      id: 2,
      name: "Downtown Branch",
      location: "456 Downtown Avenue, City, Country",
    },
    {
      id: 3,
      name: "Suburban Branch",
      location: "789 Suburban Road, City, Country",
    },
  ])

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEdit = (branch: BranchDto | null) => {
    setSelectedBranch(branch)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setBranches(branches.filter((b) => b.id !== id))
  }

  const handleSaveBranch = (branch: BranchDto) => {
    if (branch.id) {
      // Update existing branch
      setBranches(branches.map((b) => (b.id === branch.id ? branch : b)))
    } else {
      // Add new branch
      const newBranch = {
        ...branch,
        id: Math.max(...branches.map((b) => b.id || 0)) + 1,
      }
      setBranches([...branches, newBranch])
    }
    setIsDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch Management</CardTitle>
        <CardDescription>Manage your store branches and locations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search branches..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => handleAddEdit(null)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No branches found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBranches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell className="font-medium">{branch.name}</TableCell>
                      <TableCell>{branch.location}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleAddEdit(branch)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(branch.id!)}>
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

      <BranchDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        branch={selectedBranch}
        onSave={handleSaveBranch}
      />
    </Card>
  )
}
