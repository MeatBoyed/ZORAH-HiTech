"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateDepartmentForm, Staff, WorkflowForm, ScheduleForm } from "@/lib/types/departments";
import { generateFinalDepartmentObject, generateVAPIFunctionCall } from "@/lib/utils/workflow-generator";
import {
  CheckCircle,
  Building,
  Users,
  Settings,
  AlertTriangle,
  Clock,
  Edit,
  Save,
  Database,
  Code,
  Phone,
  Eye,
  EyeOff
} from "lucide-react";

interface Step6Props {
  departmentData: CreateDepartmentForm;
  staff: Staff[];
  workflow: WorkflowForm;
  schedule: ScheduleForm;
  onPrevious: () => void;
  onEdit: (step: number) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export default function Step6ReviewAndSave({
  departmentData,
  staff,
  workflow,
  schedule,
  onPrevious,
  onEdit,
  onSave,
  isSaving = false
}: Step6Props) {
  const [showDatabaseObject, setShowDatabaseObject] = useState(false);
  const [showVAPIWorkflow, setShowVAPIWorkflow] = useState(false);
  const [showVAPICode, setShowVAPICode] = useState(false);

  // Generate the final objects
  const finalObject = generateFinalDepartmentObject(
    departmentData,
    staff,
    workflow,
    schedule
  );

  const vapiCode = generateVAPIFunctionCall(finalObject);

  const getScheduleDescription = () => {
    if (schedule.cron === "manual") {
      return "Manual triggering only";
    }

    // Parse cron to human readable
    if (schedule.cron) {
      const parts = schedule.cron.split(" ");
      if (parts.length >= 5) {
        const minute = parts[0];
        const hour = parts[1];
        const dayOfWeek = parts[4];

        const timeStr = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;

        if (dayOfWeek === "*") {
          return `Daily at ${timeStr}`;
        } else if (dayOfWeek === "1,2,3,4,5") {
          return `Weekdays at ${timeStr}`;
        } else {
          const dayNames = dayOfWeek.split(",").map(d => {
            const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            return dayLabels[parseInt(d)] || d;
          });
          return `${dayNames.join(", ")} at ${timeStr}`;
        }
      }
    }

    return "Custom schedule";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-500" />
          Step 6: Review & Save
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Review all settings before creating the department
        </p>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Department Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <h3 className="font-medium">Department Details</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div>
              <Label className="text-sm font-medium">Name</Label>
              <p className="text-sm">{departmentData.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-muted-foreground">{departmentData.description}</p>
            </div>
            {departmentData.keyResponsibilities && (
              <div>
                <Label className="text-sm font-medium">Key Responsibilities</Label>
                <p className="text-sm text-muted-foreground">{departmentData.keyResponsibilities}</p>
              </div>
            )}
          </div>
        </div>

        {/* Staff */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h3 className="font-medium">Staff ({staff.length})</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="space-y-2">
              {staff.map((member) => (
                <div key={member.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium
                      ${member.position === 'Manager' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                        member.position === 'Supervisor' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                          member.position === 'Director' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                      }`}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <span className="font-medium">{member.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {member.position}
                    </Badge>
                    <span className="text-muted-foreground">{member.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workflow Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <h3 className="font-medium">Workflow Configuration</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm">{workflow.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Type</Label>
                <p className="text-sm">
                  <Badge variant="outline">{workflow.baseType}</Badge>
                </p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-muted-foreground">{workflow.description}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Call Purpose</Label>
              <p className="text-sm text-muted-foreground">{workflow.callPurpose}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Capture Fields</Label>
                <p className="text-sm">{workflow.captureFields.length} fields configured</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Report Fields</Label>
                <p className="text-sm">{workflow.reportFields.length} fields configured</p>
              </div>
            </div>
          </div>
        </div>

        {/* Escalation Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-medium">Escalation Settings</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(4)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={workflow.escalationEnabled ? "default" : "secondary"}>
                {workflow.escalationEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            {workflow.escalationEnabled && (
              <>
                <div>
                  <Label className="text-sm font-medium">Escalation Guidelines</Label>
                  <p className="text-sm text-muted-foreground">
                    {workflow.escalationReason || "No specific guidelines provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Escalation Contacts</Label>
                  <p className="text-sm">
                    {workflow.escalationContacts?.length || 0} contacts configured
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Schedule Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <h3 className="font-medium">Schedule Settings</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(5)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={schedule.enabled ? "default" : "secondary"}>
                {schedule.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Schedule</Label>
              <p className="text-sm">{getScheduleDescription()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Timezone</Label>
              <p className="text-sm">{schedule.timeZone}</p>
            </div>
            {schedule.cron && schedule.cron !== "manual" && (
              <div>
                <Label className="text-sm font-medium">Cron Expression</Label>
                <p className="text-xs font-mono text-muted-foreground">{schedule.cron}</p>
              </div>
            )}
          </div>
        </div>

        {/* Final Objects Display */}
        <div className="space-y-6 pt-6 border-t border-border">
          <div>
            <h3 className="text-lg font-semibold mb-4">Final Database & VAPI Objects</h3>
            <p className="text-sm text-gray-600 mb-4">
              Preview the final database structure and VAPI workflow that will be created.
            </p>
          </div>

          {/* Database Object */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Final Database Object
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDatabaseObject(!showDatabaseObject)}
                >
                  {showDatabaseObject ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showDatabaseObject ? 'Hide' : 'Show'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showDatabaseObject && (
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                    {JSON.stringify(finalObject, null, 2)}
                  </pre>
                </div>
              </CardContent>
            )}
          </Card>

          {/* VAPI Workflow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Generated VAPI Workflow
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVAPIWorkflow(!showVAPIWorkflow)}
                >
                  {showVAPIWorkflow ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showVAPIWorkflow ? 'Hide' : 'Show'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showVAPIWorkflow && (
              <CardContent>
                <div className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(finalObject.vapiWorkflow, null, 2)}
                  </pre>
                </div>
              </CardContent>
            )}
          </Card>

          {/* VAPI Implementation Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  VAPI Implementation Code
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVAPICode(!showVAPICode)}
                >
                  {showVAPICode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showVAPICode ? 'Hide' : 'Show'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showVAPICode && (
              <CardContent>
                <div className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    <code>{vapiCode}</code>
                  </pre>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Workflow Summary */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Ready to Deploy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-700 space-y-2">
                <p>✅ Department configuration validated</p>
                <p>✅ {staff.length} staff members configured</p>
                <p>✅ AI workflow created with {workflow.captureFields?.length || 0} capture fields</p>
                <p>✅ VAPI workflow generated with {finalObject.vapiWorkflow.steps.length} steps</p>
                <p>✅ Schedule configured for {schedule.timeZone}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t border-border">
          <Button variant="outline" onClick={onPrevious} disabled={isSaving}>
            Previous: Schedule Settings
          </Button>
          <Button onClick={onSave} disabled={isSaving} className="min-w-32">
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Department
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm font-medium ${className}`}>{children}</div>;
}
