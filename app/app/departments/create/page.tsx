"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateDepartmentForm, Staff, WorkflowForm, ScheduleForm } from "@/lib/types/departments";
import Step1DepartmentDetails from "@/components/departments/create/step1-department-details";
import Step2AssignStaff from "@/components/departments/create/step2-individual-workflows";
import Step3ConfigureWorkflow from "@/components/departments/create/step3-workflow-summary";
import Step4EscalationSettings from "@/components/departments/create/step4-escalation-settings";
import Step5ScheduleSettings from "@/components/departments/create/step5-schedule-settings";
import Step6ReviewAndSave from "@/components/departments/create/step6-review-and-save";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateDepartmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Form data state
  const [departmentData, setDepartmentData] = useState<CreateDepartmentForm>({
    name: "",
    description: "",
    keyResponsibilities: "",
  });

  const [staff, setStaff] = useState<Staff[]>([]);

  const [workflow, setWorkflow] = useState<WorkflowForm>({
    name: "",
    description: "",
    baseType: "daily-check-in",
    callPurpose: "",
    captureFields: [],
    escalationEnabled: false,
    escalationReason: "",
    escalationContacts: [],
    reportFields: [],
  });

  const [schedule, setSchedule] = useState<ScheduleForm>({
    cron: "0 8 * * 1,2,3,4,5", // Default: weekdays at 8 AM
    timeZone: "Africa/Johannesburg",
    enabled: true,
  });

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEdit = (step: number) => {
    setCurrentStep(step);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Simulate API call
      console.log("Creating department with data:", {
        department: departmentData,
        staff,
        workflow,
        schedule,
      });

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message and redirect
      alert("Department created successfully!");
      router.push("/departments");
    } catch (error) {
      console.error("Error creating department:", error);
      alert("Failed to create department. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const stepTitles = [
    "Department Details",
    "Assign Staff",
    "Configure Workflow",
    "Escalation Settings",
    "Schedule Settings",
    "Review & Save"
  ];

  const progress = (currentStep / 6) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/departments">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Departments
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Department</h1>
          <p className="text-muted-foreground">Set up a new department with AI-powered workflows</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step {currentStep} of 6: {stepTitles[currentStep - 1]}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          {stepTitles.map((title, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div key={stepNumber} className="flex items-center">
                <div className="flex flex-col items-center min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {isCompleted ? "✓" : stepNumber}
                  </div>
                  <span className={`text-xs mt-1 text-center ${isActive ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}>
                    {title}
                  </span>
                </div>
                {stepNumber < stepTitles.length && (
                  <div className={`w-12 h-0.5 mx-2 ${stepNumber < currentStep ? "bg-green-500" : "bg-muted"
                    }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        {currentStep === 1 && (
          <Step1DepartmentDetails
            data={departmentData}
            onUpdate={setDepartmentData}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <Step2AssignStaff
            staff={staff}
            onUpdate={setStaff}
            onNext={handleNext}
            onPrev={handlePrevious}
          />
        )}

        {currentStep === 3 && (
          <Step3ConfigureWorkflow
            formData={{
              department: departmentData,
              staff: staff,
              workflow: workflow,
              schedule: schedule
            }}
            updateFormData={(updates) => {
              if (updates.department) setDepartmentData(updates.department);
              if (updates.staff) setStaff(updates.staff);
              if (updates.workflow) setWorkflow(updates.workflow);
              if (updates.schedule) setSchedule(updates.schedule);
            }}
            onNext={handleNext}
            onPrev={handlePrevious}
          />
        )}

        {currentStep === 4 && (
          <Step4EscalationSettings
            workflow={workflow}
            staff={staff}
            onUpdate={setWorkflow}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}

        {currentStep === 5 && (
          <Step5ScheduleSettings
            schedule={schedule}
            onUpdate={setSchedule}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}

        {currentStep === 6 && (
          <Step6ReviewAndSave
            departmentData={departmentData}
            staff={staff}
            workflow={workflow}
            schedule={schedule}
            onPrevious={handlePrevious}
            onEdit={handleEdit}
            onSave={handleSave}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}
