import { z } from "zod";

// Staff schema with call configuration
export const StaffSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  position: z.enum(["Manager", "Supervisor", "Assistant", "Director"]),
  callOrder: z.number().optional(), // Order in which to call staff members
  callConfig: z.object({
    enabled: z.boolean(),

    // Call Settings
    timeoutMinutes: z.number().default(5),
    maxRetries: z.number().default(3),
    customScript: z.array(z.string()).optional(),

    // Individual Workflow Configuration per Staff Member
    callPurpose: z.string().default(""),
    captureFields: z.array(z.object({
      name: z.string(),
      label: z.string(),
      type: z.enum(["text", "number", "boolean", "date", "select"]),
      required: z.boolean().default(false),
      options: z.array(z.string()).optional(), // For select type
    })).default([]),

    // Escalation Settings
    escalationEnabled: z.boolean(),
    escalationContacts: z.array(z.string()).optional(),
    escalationReason: z.string().optional(),
    escalationScript: z.array(z.string()).optional(),
  }).optional(),
});

// Capture field schema
export const CaptureFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum(["text", "number", "boolean", "date", "select"]),
  options: z.array(z.string()).optional(), // For select type
  required: z.boolean().default(false),
});

// Escalation schema
export const EscalationSchema = z.object({
  enabled: z.boolean(),
  contacts: z.array(StaffSchema),
  reason: z.string(),
  fields: z.array(CaptureFieldSchema).optional(),
});

// Workflow config schema
export const WorkflowConfigSchema = z.object({
  id: z.string(),
  departmentId: z.string(),
  name: z.string(),
  description: z.string(),
  baseType: z.enum(["daily-check-in", "incident-escalation", "stock-update", "resource-update"]),
  callPurpose: z.string(),
  captureFields: z.array(CaptureFieldSchema),
  escalation: EscalationSchema.optional(),
  reportFields: z.array(CaptureFieldSchema),
  version: z.number(),
});

// Schedule schema
export const ScheduleSchema = z.object({
  id: z.string(),
  departmentId: z.string(),
  workflowId: z.string(),
  cron: z.string(), // "0 8 * * 1,3,5" (Mon/Wed/Fri at 8am)
  timeZone: z.string(), // e.g. "Africa/Johannesburg"
  enabled: z.boolean(),
});

// Department schema
export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  keyResponsibilities: z.string().optional(),
  staff: z.array(StaffSchema),
  workflowId: z.string().optional(),
  scheduleId: z.string().optional(),
  createdAt: z.string(), // ISO timestamp
  updatedAt: z.string(), // ISO timestamp
  isActive: z.boolean(),
});

// Stats for department list display
export const DepartmentStatsSchema = z.object({
  activeWorkflows: z.number(),
  recentCalls: z.number(),
  reportCount: z.number(),
  lastCallDate: z.string().optional(),
});

export const DepartmentWithStatsSchema = DepartmentSchema.extend({
  stats: DepartmentStatsSchema,
});

// Form schemas for creation/editing
export const CreateDepartmentFormSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  description: z.string().min(1, "Description is required"),
  keyResponsibilities: z.string().optional(),
});

export const StaffFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  position: z.enum(["Manager", "Supervisor", "Assistant", "Director"]),
  callOrder: z.number().optional(),
  callConfig: z.object({
    enabled: z.boolean(),
    customScript: z.string().optional(),
    escalationEnabled: z.boolean(),
    escalationContacts: z.array(z.string()).optional(),
    escalationReason: z.string().optional(),
    maxRetries: z.number().default(3),
    timeoutMinutes: z.number().default(5),
  }).optional(),
});

export const WorkflowFormSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  description: z.string().min(1, "Description is required"),
  baseType: z.enum(["daily-check-in", "incident-escalation", "stock-update", "resource-update"]),
  callPurpose: z.string().min(1, "Call purpose is required"),
  captureFields: z.array(CaptureFieldSchema).min(1, "At least one capture field is required"),
  escalationEnabled: z.boolean(),
  escalationReason: z.string().optional(),
  escalationContacts: z.array(z.string()).optional(), // Staff IDs
  reportFields: z.array(CaptureFieldSchema).min(1, "At least one report field is required"),
});

export const ScheduleFormSchema = z.object({
  cron: z.string().min(1, "Schedule is required"),
  timeZone: z.string().min(1, "Timezone is required"),
  enabled: z.boolean(),
});

// Inferred types
export type Staff = z.infer<typeof StaffSchema>;
export type CaptureField = z.infer<typeof CaptureFieldSchema>;
export type Escalation = z.infer<typeof EscalationSchema>;
export type WorkflowConfig = z.infer<typeof WorkflowConfigSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;
export type Department = z.infer<typeof DepartmentSchema>;
export type DepartmentStats = z.infer<typeof DepartmentStatsSchema>;
export type DepartmentWithStats = z.infer<typeof DepartmentWithStatsSchema>;

// Form types
export type CreateDepartmentForm = z.infer<typeof CreateDepartmentFormSchema>;
export type StaffForm = z.infer<typeof StaffFormSchema>;
export type WorkflowForm = z.infer<typeof WorkflowFormSchema>;
export type ScheduleForm = z.infer<typeof ScheduleFormSchema>;

// Combined form data for the department creation wizard
export type DepartmentFormData = {
  department?: CreateDepartmentForm;
  staff?: Staff[];
  workflow?: WorkflowForm;
  schedule?: ScheduleForm;
};

// Workflow template types
export const WORKFLOW_TEMPLATES = {
  "daily-check-in": {
    name: "Daily Check-In",
    description: "Morning calls to department managers to collect operational status",
    defaultCaptureFields: [
      { name: "jobs_today", label: "Jobs Today", type: "number" as const },
      { name: "onsite_issues", label: "Onsite Issues", type: "text" as const },
      { name: "blockers", label: "Blockers", type: "text" as const },
      { name: "ncrs", label: "NCRs", type: "number" as const },
      { name: "supervisor_notes", label: "Supervisor Notes", type: "text" as const },
    ],
    defaultReportFields: [
      { name: "summary", label: "Manager Summary", type: "text" as const },
      { name: "status", label: "Department Status", type: "select" as const, options: ["Good", "Issues", "Critical"] },
    ],
  },
  "incident-escalation": {
    name: "Incident Escalation",
    description: "Immediate escalation calls for urgent incidents",
    defaultCaptureFields: [
      { name: "incident_type", label: "Incident Type", type: "select" as const, options: ["Safety", "Equipment", "Quality", "Other"] },
      { name: "severity", label: "Severity", type: "select" as const, options: ["Low", "Medium", "High", "Critical"] },
      { name: "description", label: "Description", type: "text" as const },
      { name: "immediate_action", label: "Immediate Action Taken", type: "text" as const },
    ],
    defaultReportFields: [
      { name: "resolution", label: "Resolution", type: "text" as const },
      { name: "follow_up_required", label: "Follow-up Required", type: "boolean" as const },
    ],
  },
  "stock-update": {
    name: "Stock Update",
    description: "Regular stock and resource status updates",
    defaultCaptureFields: [
      { name: "stock_levels", label: "Stock Levels", type: "select" as const, options: ["Good", "Low", "Critical"] },
      { name: "missing_items", label: "Missing Items", type: "text" as const },
      { name: "delivery_schedule", label: "Delivery Schedule", type: "text" as const },
    ],
    defaultReportFields: [
      { name: "procurement_needed", label: "Procurement Needed", type: "boolean" as const },
      { name: "priority_items", label: "Priority Items", type: "text" as const },
    ],
  },
  "resource-update": {
    name: "Resource Update",
    description: "Personnel and equipment resource status updates",
    defaultCaptureFields: [
      { name: "staff_count", label: "Staff Count", type: "number" as const },
      { name: "equipment_status", label: "Equipment Status", type: "select" as const, options: ["All Working", "Minor Issues", "Major Issues"] },
      { name: "resource_needs", label: "Resource Needs", type: "text" as const },
    ],
    defaultReportFields: [
      { name: "resource_allocation", label: "Resource Allocation", type: "text" as const },
      { name: "efficiency_rating", label: "Efficiency Rating", type: "select" as const, options: ["Excellent", "Good", "Average", "Poor"] },
    ],
  },
} as const;

// VAPI Workflow JSON structure
export const VAPIWorkflowSchema = z.object({
  name: z.string(),
  description: z.string(),
  steps: z.array(z.object({
    type: z.enum(["call", "report", "notify"]),
    params: z.record(z.string(), z.unknown()),
    capture: z.array(z.object({
      field: z.string(),
      type: z.string(),
    })).optional(),
    on_escalation: z.object({
      if: z.string(),
      then: z.array(z.unknown()),
    }).optional(),
  })),
});

export type VAPIWorkflow = z.infer<typeof VAPIWorkflowSchema>;

// Final department object for database
export const FinalDepartmentObjectSchema = z.object({
  department: DepartmentSchema,
  workflow: WorkflowConfigSchema,
  schedule: ScheduleSchema,
  staffCallConfigs: z.array(StaffSchema),
  vapiWorkflow: VAPIWorkflowSchema,
});

export type FinalDepartmentObject = z.infer<typeof FinalDepartmentObjectSchema>;

export type WorkflowTemplateType = keyof typeof WORKFLOW_TEMPLATES;
