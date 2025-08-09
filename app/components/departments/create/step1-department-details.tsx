"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateDepartmentForm } from "@/lib/types/departments";

interface Step1Props {
  data: CreateDepartmentForm;
  onUpdate: (data: CreateDepartmentForm) => void;
  onNext: () => void;
}

export default function Step1DepartmentDetails({ data, onUpdate, onNext }: Step1Props) {
  const [errors, setErrors] = useState<Partial<CreateDepartmentForm>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: Partial<CreateDepartmentForm> = {};
    if (!data.name?.trim()) {
      newErrors.name = "Department name is required";
    }
    if (!data.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  const handleChange = (field: keyof CreateDepartmentForm, value: string) => {
    onUpdate({ ...data, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Department Details</CardTitle>
        <p className="text-sm text-muted-foreground">
          Provide basic information about the department
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Department Name *</Label>
            <Input
              id="name"
              value={data.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Construction, Logistics, Safety"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={data.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the department's main functions and responsibilities..."
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              This description will form the initial knowledge base prompt for AI interactions
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyResponsibilities">Key Responsibilities</Label>
            <Textarea
              id="keyResponsibilities"
              value={data.keyResponsibilities || ""}
              onChange={(e) => handleChange("keyResponsibilities", e.target.value)}
              placeholder="List key responsibilities (optional)..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Specific responsibilities that will help AI understand the department&apos;s scope
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              Next: Assign Staff
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
