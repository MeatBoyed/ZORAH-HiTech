import { DepartmentWithStats, Staff, WorkflowConfig, Schedule } from "@/lib/types/departments";

// Dummy staff data
export const dummyStaff: Staff[] = [
  {
    id: "staff_1",
    name: "John Smith",
    phone: "+27-81-123-4567",
    position: "Manager",
  },
  {
    id: "staff_2",
    name: "Sarah Johnson",
    phone: "+27-82-234-5678",
    position: "Supervisor",
  },
  {
    id: "staff_3",
    name: "Mike Davis",
    phone: "+27-83-345-6789",
    position: "Assistant",
  },
  {
    id: "staff_4",
    name: "Lisa Wilson",
    phone: "+27-84-456-7890",
    position: "Manager",
  },
  {
    id: "staff_5",
    name: "David Brown",
    phone: "+27-85-567-8901",
    position: "Director",
  },
];

// Dummy departments with stats
export const dummyDepartments: DepartmentWithStats[] = [
  {
    id: "dept_1",
    name: "Construction",
    description: "Main construction department responsible for building operations, site management, and project coordination.",
    keyResponsibilities: "Site safety, project timelines, quality control, resource allocation",
    staff: [dummyStaff[0], dummyStaff[1], dummyStaff[2]],
    workflowId: "workflow_1",
    scheduleId: "schedule_1",
    createdAt: "2025-01-15T08:00:00.000Z",
    updatedAt: "2025-02-01T10:30:00.000Z",
    isActive: true,
    stats: {
      activeWorkflows: 2,
      recentCalls: 15,
      reportCount: 8,
      lastCallDate: "2025-02-01T08:00:00.000Z",
    },
  },
  {
    id: "dept_2",
    name: "Logistics",
    description: "Logistics and supply chain management department handling material procurement, delivery scheduling, and inventory management.",
    keyResponsibilities: "Supply chain management, inventory control, vendor relations, delivery coordination",
    staff: [dummyStaff[3], dummyStaff[2]],
    workflowId: "workflow_2",
    scheduleId: "schedule_2",
    createdAt: "2025-01-20T09:00:00.000Z",
    updatedAt: "2025-02-01T14:15:00.000Z",
    isActive: true,
    stats: {
      activeWorkflows: 1,
      recentCalls: 8,
      reportCount: 5,
      lastCallDate: "2025-01-31T09:00:00.000Z",
    },
  },
  {
    id: "dept_3",
    name: "Safety & Compliance",
    description: "Safety monitoring and regulatory compliance department ensuring adherence to safety protocols and industry standards.",
    keyResponsibilities: "Safety inspections, compliance monitoring, incident reporting, training coordination",
    staff: [dummyStaff[4], dummyStaff[1]],
    workflowId: "workflow_3",
    scheduleId: "schedule_3",
    createdAt: "2025-01-10T07:30:00.000Z",
    updatedAt: "2025-02-01T16:45:00.000Z",
    isActive: true,
    stats: {
      activeWorkflows: 3,
      recentCalls: 12,
      reportCount: 10,
      lastCallDate: "2025-02-01T07:30:00.000Z",
    },
  },
  {
    id: "dept_4",
    name: "Quality Control",
    description: "Quality assurance department responsible for maintaining construction standards and conducting quality inspections.",
    keyResponsibilities: "Quality inspections, standard compliance, defect reporting, process improvement",
    staff: [dummyStaff[2], dummyStaff[3]],
    workflowId: undefined,
    scheduleId: undefined,
    createdAt: "2025-01-25T11:00:00.000Z",
    updatedAt: "2025-01-30T13:20:00.000Z",
    isActive: false,
    stats: {
      activeWorkflows: 0,
      recentCalls: 3,
      reportCount: 2,
      lastCallDate: "2025-01-28T11:00:00.000Z",
    },
  },
  {
    id: "dept_5",
    name: "Equipment Maintenance",
    description: "Equipment maintenance and repair department ensuring all machinery and tools are operational and properly maintained.",
    keyResponsibilities: "Equipment maintenance, repair scheduling, parts inventory, preventive maintenance",
    staff: [dummyStaff[0], dummyStaff[3], dummyStaff[4]],
    workflowId: "workflow_4",
    scheduleId: "schedule_4",
    createdAt: "2025-01-12T06:45:00.000Z",
    updatedAt: "2025-02-01T12:10:00.000Z",
    isActive: true,
    stats: {
      activeWorkflows: 1,
      recentCalls: 6,
      reportCount: 4,
      lastCallDate: "2025-01-30T06:45:00.000Z",
    },
  },
];

// Dummy workflow configs
export const dummyWorkflows: WorkflowConfig[] = [
  {
    id: "workflow_1",
    departmentId: "dept_1",
    name: "Construction Daily Check-In",
    description: "Daily morning check-in with construction managers",
    baseType: "daily-check-in",
    callPurpose: "Collect daily operational status and identify any blocking issues",
    captureFields: [
      { name: "jobs_today", label: "Jobs Today", type: "number", required: true },
      { name: "onsite_issues", label: "Onsite Issues", type: "text", required: false },
      { name: "blockers", label: "Blockers", type: "text", required: false },
      { name: "ncrs", label: "NCRs", type: "number", required: false },
      { name: "supervisor_notes", label: "Supervisor Notes", type: "text", required: false },
    ],
    escalation: {
      enabled: true,
      contacts: [dummyStaff[4]], // Director
      reason: "Critical safety issues or project delays",
      fields: [
        { name: "escalation_reason", label: "Escalation Reason", type: "text", required: false },
        { name: "urgency", label: "Urgency Level", type: "select", options: ["Medium", "High", "Critical"], required: true },
      ],
    },
    reportFields: [
      { name: "summary", label: "Manager Summary", type: "text", required: false },
      { name: "status", label: "Department Status", type: "select", options: ["Good", "Issues", "Critical"], required: true },
    ],
    version: 1,
  },
  {
    id: "workflow_2",
    departmentId: "dept_2",
    name: "Logistics Stock Update",
    description: "Daily stock and supply status update",
    baseType: "stock-update",
    callPurpose: "Monitor inventory levels and delivery schedules",
    captureFields: [
      { name: "stock_levels", label: "Stock Levels", type: "select", options: ["Good", "Low", "Critical"], required: true },
      { name: "missing_items", label: "Missing Items", type: "text", required: false },
      { name: "delivery_schedule", label: "Delivery Schedule", type: "text", required: false },
    ],
    reportFields: [
      { name: "procurement_needed", label: "Procurement Needed", type: "boolean", required: false },
      { name: "priority_items", label: "Priority Items", type: "text", required: false },
    ],
    version: 1,
  },
];

// Dummy schedules
export const dummySchedules: Schedule[] = [
  {
    id: "schedule_1",
    departmentId: "dept_1",
    workflowId: "workflow_1",
    cron: "0 8 * * 1,2,3,4,5", // Weekdays at 8 AM
    timeZone: "Africa/Johannesburg",
    enabled: true,
  },
  {
    id: "schedule_2",
    departmentId: "dept_2",
    workflowId: "workflow_2",
    cron: "0 9 * * 1,3,5", // Mon, Wed, Fri at 9 AM
    timeZone: "Africa/Johannesburg",
    enabled: true,
  },
  {
    id: "schedule_3",
    departmentId: "dept_3",
    workflowId: "workflow_3",
    cron: "0 7 * * *", // Daily at 7 AM
    timeZone: "Africa/Johannesburg",
    enabled: true,
  },
  {
    id: "schedule_4",
    departmentId: "dept_5",
    workflowId: "workflow_4",
    cron: "0 6 * * 1,4", // Mon and Thu at 6 AM
    timeZone: "Africa/Johannesburg",
    enabled: true,
  },
];

// Helper functions for development
export const getDepartmentById = (id: string) =>
  dummyDepartments.find(dept => dept.id === id);

export const getWorkflowById = (id: string) =>
  dummyWorkflows.find(workflow => workflow.id === id);

export const getScheduleById = (id: string) =>
  dummySchedules.find(schedule => schedule.id === id);

export const getStaffById = (id: string) =>
  dummyStaff.find(staff => staff.id === id);
