"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DepartmentFormData } from "@/lib/types/departments";
import { generateVAPIWorkflow, generateFinalDepartmentObject } from "@/lib/utils/workflow-generator";
import { CheckCircle, Users, Settings, Code, Phone } from "lucide-react";

interface Step3WorkflowSummaryProps {
  formData: DepartmentFormData;
  updateFormData: (updates: Partial<DepartmentFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step3WorkflowSummary({
  formData,
  onNext,
  onPrev,
}: Step3WorkflowSummaryProps) {
  const [vapiWorkflow, setVapiWorkflow] = useState<ReturnType<typeof generateVAPIWorkflow> | null>(null);
  const [finalDepartmentObject, setFinalDepartmentObject] = useState<ReturnType<typeof generateFinalDepartmentObject> | null>(null);

  useEffect(() => {
    // Generate VAPI workflow and final department object
    const enabledStaff = (formData.staff || []).filter(s => s.callConfig?.enabled);

    if (enabledStaff.length > 0 && formData.department) {
      try {
        const workflow = generateVAPIWorkflow(
          {
            id: "temp-dept",
            name: formData.department.name,
            description: formData.department.description,
            keyResponsibilities: formData.department.keyResponsibilities,
            staff: formData.staff || [],
            workflowId: undefined,
            scheduleId: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true,
          },
          formData.staff || []
        );

        const workflowData = formData.workflow || {
          name: "",
          description: "",
          baseType: "daily-check-in" as const,
          callPurpose: "",
          captureFields: [],
          escalationEnabled: false,
          reportFields: [],
        };
        const scheduleData = formData.schedule || {
          cron: "0 8 * * 1,2,3,4,5",
          timeZone: "Africa/Johannesburg",
          enabled: true,
        };
        const finalObject = generateFinalDepartmentObject(
          { ...formData.department },
          formData.staff || [],
          workflowData as unknown as Record<string, unknown>,
          scheduleData as unknown as Record<string, unknown>
        );

        setVapiWorkflow(workflow);
        setFinalDepartmentObject(finalObject);
      } catch (error: unknown) {
        console.error("Error generating workflow:", error);
      }
    }
  }, [formData]);

  const enabledStaff = (formData.staff || []).filter(s => s.callConfig?.enabled);
  const totalStaff = formData.staff?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Workflow Summary & Preview
        </h2>
        <p className="text-gray-600">
          Review your individual staff workflow configurations and preview the generated backend code.
        </p>
      </div>

      {/* Staff Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Staff Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalStaff}</div>
              <div className="text-sm text-gray-500">Total Staff</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{enabledStaff.length}</div>
              <div className="text-sm text-gray-500">AI Workflow Enabled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{enabledStaff.filter(s => s.callConfig?.escalationEnabled).length}</div>
              <div className="text-sm text-gray-500">With Escalation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{enabledStaff.reduce((sum, s) => sum + (s.callConfig?.captureFields?.length || 0), 0)}</div>
              <div className="text-sm text-gray-500">Total Data Fields</div>
            </div>
          </div>

          {enabledStaff.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Individual Staff Workflows:</h4>
              {enabledStaff.map((staff, index) => (
                <div key={staff.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{staff.name} ({staff.position})</span>
                      <span className="text-sm text-gray-500">Call Order: {staff.callOrder || index + 1}</span>
                    </div>
                    {staff.callConfig?.escalationEnabled && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Escalation Enabled</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Purpose:</strong> {staff.callConfig?.callPurpose || "Not specified"}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Capture Fields:</strong> {staff.callConfig?.captureFields?.length || 0} fields
                    {(staff.callConfig?.captureFields?.length || 0) > 0 && (
                      <span className="ml-2">
                        ({staff.callConfig?.captureFields?.map(f => f.name).join(", ")})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* VAPI Workflow Preview */}
      {vapiWorkflow && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Generated VAPI Workflow Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                {JSON.stringify(vapiWorkflow, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backend Database Object Preview */}
      {finalDepartmentObject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Backend Code & Database Object Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                {JSON.stringify(finalDepartmentObject, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Department details configured</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{totalStaff} staff member(s) added</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{enabledStaff.length} individual workflow(s) configured</span>
            </div>
            {enabledStaff.length > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>VAPI workflow ready for deployment</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={enabledStaff.length === 0}
        >
          Continue to Schedule Settings
        </Button>
      </div>
    </div>
  );
}
