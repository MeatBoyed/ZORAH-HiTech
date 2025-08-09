import { z } from "zod";

// Simplified schemas for the AI Assistant Configuration
export const AIAssistantConfigSchema = z.object({
    // Company Information
    companyName: z.string().min(1, "Company name is required"),
    industryType: z.string().min(1, "Industry type is required"),
    primaryLanguage: z.string().min(1, "Primary language is required"),
    timezone: z.string().min(1, "Timezone is required"),
    operationalHoursStart: z.string().min(1, "Start time is required"),
    operationalHoursEnd: z.string().min(1, "End time is required"),

    // Voice Agent Identity
    agentName: z.string().min(1, "Agent name is required"),
    personality: z.string().min(1, "Personality is required"),
    toneOfVoice: z.string().min(1, "Tone of voice is required"),
    formalityLevel: z.enum(["formal", "neutral", "informal"]),

    // Department Structure
    departments: z.array(z.string()).min(1, "At least one department is required"),
    dailyCallDepartments: z.array(z.string()),
    departmentSpecificQuestions: z.string().optional(),

    // Call Workflow
    rolesToContact: z.array(z.string()).min(1, "At least one role is required"),
    callOrder: z.array(z.string()).min(1, "Call order is required"),
    reportRecipients: z.array(z.string()).min(1, "At least one report recipient is required"),

    // Question Set
    useDefaultQuestionSet: z.boolean(),
    complianceChecks: z.string().optional(),
    businessTerms: z.string().optional(),

    // Prompt Structure
    customSystemPrompt: z.string().optional(),
    sensitiveTopics: z.string().optional(),
    escalationProtocols: z.string().optional(),

    // Summary Requirements
    summaryStructure: z.enum(["bullet-points", "full-paragraph", "key-highlights"]),
    preferredFormat: z.enum(["json", "csv", "slack", "email"]),
    requiredFields: z.array(z.string()),
    dataValidation: z.string().optional(),

    // Cost and Duration
    calculateDurations: z.boolean(),
    includeCosting: z.boolean(),
    costPerMinute: z.number().optional(),

    // Integration Settings
    crmSystem: z.string().optional(),
    webhookUrl: z.string().optional(),
    apiKeys: z.string().optional(),
});

export type AIAssistantConfig = z.infer<typeof AIAssistantConfigSchema>;

// Form field configuration type
export type FormFieldConfig = {
    name: string;
    label: string;
    type: "text" | "email" | "number" | "textarea" | "select" | "multiselect" | "checkbox" | "radio" | "time";
    placeholder?: string;
    description?: string;
    options?: { value: string; label: string }[];
    required?: boolean;
    step?: string;
    min?: number;
    max?: number;
};

// Form section configuration
export type FormSectionConfig = {
    title: string;
    description: string;
    fields: FormFieldConfig[];
};

// Constants for options
export const INDUSTRY_OPTIONS = [
    { value: "manufacturing", label: "Manufacturing" },
    { value: "healthcare", label: "Healthcare" },
    { value: "technology", label: "Technology" },
    { value: "retail", label: "Retail" },
    { value: "finance", label: "Finance" },
    { value: "construction", label: "Construction" },
    { value: "education", label: "Education" },
    { value: "hospitality", label: "Hospitality" },
    { value: "transportation", label: "Transportation" },
    { value: "energy", label: "Energy" },
    { value: "agriculture", label: "Agriculture" },
    { value: "other", label: "Other" }
];

export const LANGUAGE_OPTIONS = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "portuguese", label: "Portuguese" },
    { value: "italian", label: "Italian" },
    { value: "dutch", label: "Dutch" },
    { value: "chinese", label: "Chinese" },
    { value: "japanese", label: "Japanese" },
    { value: "korean", label: "Korean" },
    { value: "arabic", label: "Arabic" },
    { value: "russian", label: "Russian" }
];

export const TIMEZONE_OPTIONS = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "America/New_York" },
    { value: "America/Chicago", label: "America/Chicago" },
    { value: "America/Denver", label: "America/Denver" },
    { value: "America/Los_Angeles", label: "America/Los_Angeles" },
    { value: "Europe/London", label: "Europe/London" },
    { value: "Europe/Paris", label: "Europe/Paris" },
    { value: "Europe/Berlin", label: "Europe/Berlin" },
    { value: "Asia/Tokyo", label: "Asia/Tokyo" },
    { value: "Asia/Shanghai", label: "Asia/Shanghai" },
    { value: "Asia/Seoul", label: "Asia/Seoul" },
    { value: "Australia/Sydney", label: "Australia/Sydney" },
    { value: "Africa/Johannesburg", label: "Africa/Johannesburg" }
];

export const PERSONALITY_OPTIONS = [
    { value: "professional", label: "Professional" },
    { value: "empathetic", label: "Empathetic" },
    { value: "concise", label: "Concise" },
    { value: "friendly", label: "Friendly" },
    { value: "analytical", label: "Analytical" },
    { value: "supportive", label: "Supportive" },
    { value: "direct", label: "Direct" },
    { value: "enthusiastic", label: "Enthusiastic" }
];

export const TONE_OPTIONS = [
    { value: "polite", label: "Polite" },
    { value: "assertive", label: "Assertive" },
    { value: "calm", label: "Calm" },
    { value: "warm", label: "Warm" },
    { value: "neutral", label: "Neutral" },
    { value: "confident", label: "Confident" },
    { value: "reassuring", label: "Reassuring" }
];

export const FORMALITY_OPTIONS = [
    { value: "formal", label: "Formal" },
    { value: "neutral", label: "Neutral" },
    { value: "informal", label: "Informal" }
];

export const DEPARTMENT_OPTIONS = [
    { value: "cutting", label: "Cutting" },
    { value: "welding", label: "Welding" },
    { value: "sales", label: "Sales" },
    { value: "production", label: "Production" },
    { value: "quality-control", label: "Quality Control" },
    { value: "maintenance", label: "Maintenance" },
    { value: "shipping", label: "Shipping" },
    { value: "receiving", label: "Receiving" },
    { value: "assembly", label: "Assembly" },
    { value: "packaging", label: "Packaging" },
    { value: "inventory", label: "Inventory" },
    { value: "customer-service", label: "Customer Service" }
];

export const ROLE_OPTIONS = [
    { value: "supervisor", label: "Supervisor" },
    { value: "manager", label: "Manager" },
    { value: "director", label: "Director" },
    { value: "team-lead", label: "Team Lead" },
    { value: "assistant-manager", label: "Assistant Manager" },
    { value: "coo", label: "COO" },
    { value: "department-head", label: "Department Head" },
    { value: "shift-supervisor", label: "Shift Supervisor" }
];

export const SUMMARY_STRUCTURE_OPTIONS = [
    { value: "bullet-points", label: "Bullet Points" },
    { value: "full-paragraph", label: "Full Paragraph" },
    { value: "key-highlights", label: "Key Highlights Only" }
];

export const FORMAT_OPTIONS = [
    { value: "json", label: "JSON (Structured Data)" },
    { value: "csv", label: "CSV (Spreadsheet Compatible)" },
    { value: "slack", label: "Slack Message" },
    { value: "email", label: "Email Report" }
];

export const REQUIRED_FIELD_OPTIONS = [
    { value: "timestamp", label: "Timestamp" },
    { value: "department", label: "Department" },
    { value: "respondent-name", label: "Respondent Name" },
    { value: "respondent-role", label: "Respondent Role" },
    { value: "production-status", label: "Production Status" },
    { value: "safety-incidents", label: "Safety Incidents" },
    { value: "equipment-status", label: "Equipment Status" },
    { value: "staff-attendance", label: "Staff Attendance" },
    { value: "quality-issues", label: "Quality Issues" },
    { value: "ncrs", label: "NCRs (Non-Conformance Reports)" },
    { value: "jobs-scheduled", label: "Jobs Scheduled" },
    { value: "jobs-completed", label: "Jobs Completed" },
    { value: "maintenance-requests", label: "Maintenance Requests" },
    { value: "resource-requirements", label: "Resource Requirements" },
    { value: "call-duration", label: "Call Duration" },
    { value: "follow-up-required", label: "Follow-up Required" },
    { value: "priority-level", label: "Priority Level" },
    { value: "notes-comments", label: "Notes/Comments" }
];

export const CRM_OPTIONS = [
    { value: "airtable", label: "Airtable" },
    { value: "hubspot", label: "HubSpot" },
    { value: "salesforce", label: "Salesforce" },
    { value: "google-sheets", label: "Google Sheets" },
    { value: "microsoft-365", label: "Microsoft 365" },
    { value: "notion", label: "Notion" },
    { value: "monday", label: "Monday.com" },
    { value: "trello", label: "Trello" },
    { value: "asana", label: "Asana" },
    { value: "custom", label: "Custom System" },
    { value: "none", label: "No Integration" }
];
