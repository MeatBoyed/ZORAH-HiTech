"use client"

import {
  Authenticated,
  Unauthenticated,
} from "convex/react";
import Link from "next/link";
import { workflows, type Workflow } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Phone, Bot, Zap } from "lucide-react"
import { SignInForm } from "@/components/sign-in-form";
import { UserProfile } from "@clerk/nextjs"

function getStatusColor(status: string) {
  switch (status) {
    case "Success":
      return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
    case "Partial":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
    case "Failed":
      return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
  }
}

// Get next scheduled workflow (tomorrow at 8:00 AM)
function getNextWorkflow() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(8, 0, 0, 0)

  return {
    date: tomorrow.toLocaleDateString(),
    time: "8:00 AM",
    managers: ["Sarah Johnson", "Mike Chen"],
    estimatedCost: "$10.50",
    estimatedDuration: "25 minutes",
  }
}

export default function HomePage() {
  const nextWorkflow = getNextWorkflow()
  // const workflows = useQuery(api.entities.reports.list, {});
  // console.log("Reports:", reports);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Daily Operations Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">AI-powered workflow management and operational insights</p>
        {/* <UserProfile /> */}
      </div>

      {/* <Authenticated> */}
      {/* About Section */}
      <Card className="border-2 border-primary">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Bot className="h-5 w-5 text-green-600" />
            <span>
              Powered by <span className="text-green-600">Zorah AI</span> Technology
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            This advanced operations management system leverages cutting-edge AI technologies to automate daily manager
            check-ins through intelligent landline calling, API integrations, and autonomous agent capabilities. Our AI
            agents conduct natural conversations, analyze responses, and generate actionable insights for your business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-green-600" />
              <span className="text-xs text-muted-foreground">Automated Landline Calling</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="text-xs text-muted-foreground">API Integration & Automation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4 text-green-600" />
              <span className="text-xs text-muted-foreground">Intelligent AI Agents</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Need Technical Support?</strong> For any technical assistance, system configuration, or advanced
              features, please contact <span className="text-green-600 font-medium">Zorah AI</span> directly. Our
              technical team is ready to help optimize your workflow automation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Scheduled Workflow */}
      <Card className="border-l-4 border-l-green-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Clock className="h-5 w-5 text-green-600" />
            <span>Next Scheduled Workflow</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Scheduled Date</p>
              <p className="text-foreground font-semibold">{nextWorkflow.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Time</p>
              <p className="text-foreground font-semibold">{nextWorkflow.time}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Managers</p>
              <p className="text-foreground font-semibold text-sm">{nextWorkflow.managers.join(", ")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Est. Cost</p>
              <p className="text-foreground font-semibold">{nextWorkflow.estimatedCost}</p>
            </div>
          </div>
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-950 rounded-md">
            <p className="text-xs text-green-700 dark:text-green-300">
              ✓ System ready for automated execution. Estimated duration: {nextWorkflow.estimatedDuration}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Manager</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Call Count</TableHead>
                  <TableHead className="text-xs">Total Cost</TableHead>
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows.map((workflow: Workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell className="font-medium text-sm">
                      {new Date(workflow.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">{workflow.manager}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(workflow.status)} text-xs`}>{workflow.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{workflow.callIds.length}</TableCell>
                    <TableCell className="text-sm">${workflow.totalCost.toFixed(2)}</TableCell>
                    <TableCell>
                      <Link
                        href={`/workflows/${workflow.id}`}
                        className="text-foreground hover:text-muted-foreground font-medium text-sm"
                      >
                        View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* </Authenticated> */}
      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
    </div>
  )
}

