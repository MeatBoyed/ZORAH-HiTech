"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorkflowForm, CaptureField, WorkflowTemplateType, WORKFLOW_TEMPLATES } from "@/lib/types/departments";
import { Plus, Trash2, Settings, Zap } from "lucide-react";

interface Step3Props {
  workflow: WorkflowForm;
  onUpdate: (workflow: WorkflowForm) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Step3ConfigureWorkflow({
  workflow,
  onUpdate,
  onNext,
  onPrevious
}: Step3Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newCaptureField, setNewCaptureField] = useState<CaptureField>({
    name: "",
    label: "",
    type: "text",
    required: false
  });
  const [newReportField, setNewReportField] = useState<CaptureField>({
    name: "",
    label: "",
    type: "text",
    required: false
  });

  // Load template fields when workflow type changes
  useEffect(() => {
    if (workflow.baseType && WORKFLOW_TEMPLATES[workflow.baseType]) {
      const template = WORKFLOW_TEMPLATES[workflow.baseType];
      if (workflow.captureFields.length === 0) {
        const captureFields = template.defaultCaptureFields.map(field => ({
          name: field.name,
          label: field.label,
          type: field.type,
          options: 'options' in field && field.options ? [...field.options] : undefined,
          required: false,
        }));

        const reportFields = template.defaultReportFields.map(field => ({
          name: field.name,
          label: field.label,
          type: field.type,
          options: 'options' in field && field.options ? [...field.options] : undefined,
          required: false,
        }));

        onUpdate({
          ...workflow,
          captureFields,
          reportFields,
        });
      }
    }
  }, [workflow, onUpdate]);

  const handleBaseTypeChange = (baseType: WorkflowTemplateType) => {
    const template = WORKFLOW_TEMPLATES[baseType];

    const captureFields = template.defaultCaptureFields.map(field => ({
      name: field.name,
      label: field.label,
      type: field.type,
      options: 'options' in field && field.options ? [...field.options] : undefined,
      required: false,
    }));

    const reportFields = template.defaultReportFields.map(field => ({
      name: field.name,
      label: field.label,
      type: field.type,
      options: 'options' in field && field.options ? [...field.options] : undefined,
      required: false,
    }));

    onUpdate({
      ...workflow,
      baseType,
      name: workflow.name || template.name,
      description: workflow.description || template.description,
      captureFields,
      reportFields,
    });
  };

  const handleAddCaptureField = () => {
    if (!newCaptureField.name || !newCaptureField.label) return;

    // Check for duplicate names
    if (workflow.captureFields.some(f => f.name === newCaptureField.name)) {
      alert("Field name already exists");
      return;
    }

    onUpdate({
      ...workflow,
      captureFields: [...workflow.captureFields, { ...newCaptureField }]
    });
  setNewCaptureField({ name: "", label: "", type: "text", required: false });
  };

  const handleRemoveCaptureField = (index: number) => {
    onUpdate({
      ...workflow,
      captureFields: workflow.captureFields.filter((_, i) => i !== index)
    });
  };

  const handleAddReportField = () => {
    if (!newReportField.name || !newReportField.label) return;

    if (workflow.reportFields.some(f => f.name === newReportField.name)) {
      alert("Field name already exists");
      return;
    }

    onUpdate({
      ...workflow,
      reportFields: [...workflow.reportFields, { ...newReportField }]
    });
  setNewReportField({ name: "", label: "", type: "text", required: false });
  };

  const handleRemoveReportField = (index: number) => {
    onUpdate({
      ...workflow,
      reportFields: workflow.reportFields.filter((_, i) => i !== index)
    });
  };

  const handleNext = () => {
    // Validation
    const newErrors: Record<string, string> = {};
    if (!workflow.name?.trim()) newErrors.name = "Workflow name is required";
    if (!workflow.description?.trim()) newErrors.description = "Description is required";
    if (!workflow.baseType) newErrors.baseType = "Workflow type is required";
    if (!workflow.callPurpose?.trim()) newErrors.callPurpose = "Call purpose is required";
    if (workflow.captureFields.length === 0) newErrors.captureFields = "At least one capture field is required";
    if (workflow.reportFields.length === 0) newErrors.reportFields = "At least one report field is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: Configure Workflow</CardTitle>
        <p className="text-sm text-muted-foreground">
          Set up the AI workflow that will handle calls and data collection
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Workflow Basic Info */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Workflow Name *</Label>
              <Input
                id="workflow-name"
                value={workflow.name || ""}
                onChange={(e) => onUpdate({ ...workflow, name: e.target.value })}
                placeholder="e.g., Construction Daily Check-In"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workflow-type">Workflow Type *</Label>
              <Select
                value={workflow.baseType || ""}
                onValueChange={handleBaseTypeChange}
              >
                <SelectTrigger className={errors.baseType ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select workflow type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(WORKFLOW_TEMPLATES).map(([key, template]) => (
                    <SelectItem key={key} value={key}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.baseType && <p className="text-sm text-destructive">{errors.baseType}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workflow-description">Workflow Description *</Label>
            <Textarea
              id="workflow-description"
              value={workflow.description || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate({ ...workflow, description: e.target.value })}
              placeholder="Describe what this workflow does..."
              rows={3}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="call-purpose">Call Purpose *</Label>
            <Textarea
              id="call-purpose"
              value={workflow.callPurpose || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate({ ...workflow, callPurpose: e.target.value })}
              placeholder="What is the purpose of this call? This helps the AI understand the context..."
              rows={2}
              className={errors.callPurpose ? "border-destructive" : ""}
            />
            {errors.callPurpose && <p className="text-sm text-destructive">{errors.callPurpose}</p>}
          </div>
        </div>

        {/* Capture Fields */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <h3 className="font-medium">Data Capture Fields</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Define what information the AI should collect during calls
          </p>

          {/* Existing Capture Fields */}
          <div className="space-y-2">
            {workflow.captureFields.map((field, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                <div className="flex-1 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="font-medium">{field.label}</span>
                  </div>
                  <div className="text-muted-foreground">
                    {field.name}
                  </div>
                  <div className="text-muted-foreground">
                    {field.type}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCaptureField(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add New Capture Field */}
          <div className="border border-dashed border-border rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3">Add Custom Field</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                placeholder="Field name (e.g., jobs_today)"
                value={newCaptureField.name}
                onChange={(e) => setNewCaptureField({ ...newCaptureField, name: e.target.value })}
              />
              <Input
                placeholder="Field label (e.g., Jobs Today)"
                value={newCaptureField.label}
                onChange={(e) => setNewCaptureField({ ...newCaptureField, label: e.target.value })}
              />
              <Select
                value={newCaptureField.type}
                onValueChange={(value: "text" | "number" | "boolean" | "select") =>
                  setNewCaptureField({ ...newCaptureField, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Yes/No</SelectItem>
                  <SelectItem value="select">Dropdown</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddCaptureField} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {errors.captureFields && <p className="text-sm text-destructive">{errors.captureFields}</p>}
        </div>

        {/* Report Fields */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <h3 className="font-medium">Report Fields</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Define what information should be included in the generated reports
          </p>

          {/* Existing Report Fields */}
          <div className="space-y-2">
            {workflow.reportFields.map((field, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                <div className="flex-1 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="font-medium">{field.label}</span>
                  </div>
                  <div className="text-muted-foreground">
                    {field.name}
                  </div>
                  <div className="text-muted-foreground">
                    {field.type}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveReportField(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add New Report Field */}
          <div className="border border-dashed border-border rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3">Add Custom Report Field</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                placeholder="Field name (e.g., summary)"
                value={newReportField.name}
                onChange={(e) => setNewReportField({ ...newReportField, name: e.target.value })}
              />
              <Input
                placeholder="Field label (e.g., Summary)"
                value={newReportField.label}
                onChange={(e) => setNewReportField({ ...newReportField, label: e.target.value })}
              />
              <Select
                value={newReportField.type}
                onValueChange={(value: "text" | "number" | "boolean" | "select") =>
                  setNewReportField({ ...newReportField, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Yes/No</SelectItem>
                  <SelectItem value="select">Dropdown</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddReportField} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {errors.reportFields && <p className="text-sm text-destructive">{errors.reportFields}</p>}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrevious}>
            Previous: Assign Staff
          </Button>
          <Button onClick={handleNext}>
            Next: Escalation Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
