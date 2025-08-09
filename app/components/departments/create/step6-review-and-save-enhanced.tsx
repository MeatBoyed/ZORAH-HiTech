"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepartmentFormData } from "@/lib/types/departments";
import { generateFinalDepartmentObject, generateVAPIFunctionCall } from "@/lib/utils/workflow-generator";
import {
  CheckCircle,
  Users,
  Calendar,
  Settings,
  Database,
  Code,
  Phone,
  Eye,
  EyeOff
} from "lucide-react";

interface Step6ReviewAndSaveProps {
  formData: DepartmentFormData;
  onPrev: () => void;
  onSave: () => void;
}

export default function Step6ReviewAndSave({
  formData,
  onPrev,
  onSave,
}: Step6ReviewAndSaveProps) {
  const [showDatabaseObject, setShowDatabaseObject] = useState(true);
  const [showVAPIWorkflow, setShowVAPIWorkflow] = useState(true);
  const [showVAPICode, setShowVAPICode] = useState(false);

  // Generate the final objects
  const finalObject = generateFinalDepartmentObject(
    formData.department,
    formData.staff || [],
    formData.workflow,
    formData.schedule
  );

  const vapiCode = generateVAPIFunctionCall(finalObject);

  const enabledStaff = (formData.staff || []).filter((s: any) => s.callConfig?.enabled);
  const escalationEnabledStaff = enabledStaff.filter((s: any) => s.callConfig?.escalationEnabled);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review & Save Department
        </h2>
        <p className="text-gray-600">
          Review all the details and see the final database structure and VAPI workflow that will be created.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Department</p>
                <p className="text-xs text-gray-600">{formData.department?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Staff Members</p>
                <p className="text-xs text-gray-600">{formData.staff?.length || 0} total</p>
                <p className="text-xs text-green-600">{enabledStaff.length} call-enabled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">AI Workflow</p>
                <p className="text-xs text-gray-600">{formData.workflow?.baseType}</p>
                <p className="text-xs text-orange-600">{escalationEnabledStaff.length} with escalation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm font-medium">Schedule</p>
                <p className="text-xs text-gray-600">{formData.schedule?.timeZone}</p>
                <p className="text-xs text-green-600">
                  {formData.schedule?.enabled ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Department Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span> {formData.department?.name}
              </div>
              <div>
                <span className="font-medium">Description:</span> {formData.department?.description}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Staff Call Configuration</h4>
            <div className="space-y-2">
              {enabledStaff.map((staff: any) => (
                <div key={staff.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Order {staff.callOrder}</Badge>
                    <div>
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-xs text-gray-600">{staff.role} • {staff.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {staff.callConfig?.timeoutMinutes}min timeout
                    </Badge>
                    <Badge variant="secondary">
                      {staff.callConfig?.maxRetries} retries
                    </Badge>
                    {staff.callConfig?.escalationEnabled && (
                      <Badge className="bg-orange-100 text-orange-800">
                        Escalation
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Workflow Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Type:</span> {formData.workflow?.baseType}
              </div>
              <div>
                <span className="font-medium">Purpose:</span> {formData.workflow?.callPurpose}
              </div>
              <div>
                <span className="font-medium">Capture Fields:</span> {formData.workflow?.captureFields?.length || 0}
              </div>
              <div>
                <span className="font-medium">Report Fields:</span> {formData.workflow?.reportFields?.length || 0}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
            <p>✅ {enabledStaff.length} staff members configured for AI calls</p>
            <p>✅ Call order and escalation rules defined</p>
            <p>✅ VAPI workflow generated with {finalObject.vapiWorkflow.steps.length} steps</p>
            <p>✅ Schedule configured for {formData.schedule?.timeZone}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button
          type="button"
          onClick={onSave}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Save Department
        </Button>
      </div>
    </div>
  );
}
