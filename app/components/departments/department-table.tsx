"use client"

import { DepartmentWithStats } from "@/lib/types/departments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Edit, Trash2, Play, Pause, Users, Phone, FileText } from "lucide-react";
import Link from "next/link";

interface DepartmentTableProps {
  departments: DepartmentWithStats[];
}

export default function DepartmentTable({ departments }: DepartmentTableProps) {
  const handleToggleStatus = (departmentId: string) => {
    // TODO: Implement status toggle
    console.log("Toggle status for department:", departmentId);
  };

  const handleDelete = (departmentId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete department:", departmentId);
  };

  const formatLastCall = (lastCallDate?: string) => {
    if (!lastCallDate) return "Never";
    try {
      const date = new Date(lastCallDate);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${diffInHours} hours ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return "1 day ago";
      if (diffInDays < 7) return `${diffInDays} days ago`;

      const diffInWeeks = Math.floor(diffInDays / 7);
      if (diffInWeeks === 1) return "1 week ago";
      if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;

      return date.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  if (departments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No departments found</h3>
            <p className="text-sm">Create your first department to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile/Tablet Cards */}
      <div className="grid gap-4 md:hidden">
        {departments.map((department) => (
          <Card key={department.id} className={`p-4 ${!department.isActive ? 'opacity-60' : ''}`}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-lg">{department.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {department.description}
                  </p>
                </div>
                <Badge variant={department.isActive ? "default" : "secondary"}>
                  {department.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{department.staff.length} staff</span>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-muted-foreground" />
                  <span>{department.stats.activeWorkflows} workflows</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{department.stats.recentCalls} calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{department.stats.reportCount} reports</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Last call: {formatLastCall(department.stats.lastCallDate)}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/departments/${department.id}`}>
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/departments/${department.id}/edit`}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(department.id)}
                >
                  {department.isActive ? (
                    <Pause className="h-3 w-3 mr-1" />
                  ) : (
                    <Play className="h-3 w-3 mr-1" />
                  )}
                  {department.isActive ? "Pause" : "Activate"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-sm">Department</th>
                  <th className="text-left p-4 font-medium text-sm">Staff</th>
                  <th className="text-left p-4 font-medium text-sm">Workflows</th>
                  <th className="text-left p-4 font-medium text-sm">Recent Calls</th>
                  <th className="text-left p-4 font-medium text-sm">Reports</th>
                  <th className="text-left p-4 font-medium text-sm">Last Call</th>
                  <th className="text-left p-4 font-medium text-sm">Status</th>
                  <th className="text-right p-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((department) => (
                  <tr
                    key={department.id}
                    className={`border-b border-border hover:bg-muted/50 transition-colors ${!department.isActive ? 'opacity-60' : ''
                      }`}
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{department.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {department.description}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {department.staff.length}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Play className="h-4 w-4 text-muted-foreground" />
                        {department.stats.activeWorkflows}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {department.stats.recentCalls}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {department.stats.reportCount}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-muted-foreground">
                        {formatLastCall(department.stats.lastCallDate)}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={department.isActive ? "default" : "secondary"}>
                        {department.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/departments/${department.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/departments/${department.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(department.id)}
                        >
                          {department.isActive ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(department.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
