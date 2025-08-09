import { z } from "zod";

// Company Information Schema
export const CompanyInformationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industryType: z.string().min(1, "Industry type is required"),
  primaryLanguage: z.string().min(1, "Primary language is required"),
  timezone: z.string().min(1, "Timezone is required"),
  operationalHours: z.object({
    start: z.string().min(1, "Start time is required"),
    end: z.string().min(1, "End time is required"),
  }),
});

// Voice Agent Identity Schema
export const VoiceAgentIdentitySchema = z.object({
  agentName: z.string().min(1, "Agent name is required"),
  personality: z.string().min(1, "Personality is required"),
  toneOfVoice: z.string().min(1, "Tone of voice is required"),
  formalityLevel: z.enum(["formal", "neutral", "informal"]),
});

// Department Structure Schema
export const DepartmentStructureSchema = z.object({
  departments: z.array(z.string()).min(1, "At least one department is required"),
  dailyCallDepartments: z.array(z.string()),
  departmentSpecificQuestions: z.string().optional(),
});

// Call Workflow Schema
export const CallWorkflowSchema = z.object({
  rolesToContact: z.array(z.string()).min(1, "At least one role is required"),
  callOrder: z.array(z.string()).min(1, "Call order is required"),
  reportRecipients: z.array(z.string()).min(1, "At least one report recipient is required"),
});

// Question Set Schema
export const QuestionSetSchema = z.object({
  useDefaultQuestionSet: z.boolean(),
  customQuestions: z.array(z.object({
    department: z.string(),
    role: z.string(),
    question: z.string(),
  })).optional(),
  complianceChecks: z.string().optional(),
  businessTerms: z.string().optional(),
});

// Prompt Structure Schema
export const PromptStructureSchema = z.object({
  customSystemPrompt: z.string().optional(),
  sensitiveTopics: z.string().optional(),
  escalationProtocols: z.string().optional(),
});

// Summary Requirements Schema
export const SummaryRequirementsSchema = z.object({
  structure: z.enum(["bullet-points", "full-paragraph", "key-highlights"]),
  recipients: z.array(z.object({
    recipient: z.string(),
    summaryType: z.string(),
  })),
});

// Output Formatting Schema
export const OutputFormattingSchema = z.object({
  preferredFormat: z.enum(["json", "csv", "slack", "email"]),
  requiredFields: z.array(z.string()),
  dataValidation: z.string().optional(),
});

// Cost and Duration Schema
export const CostDurationSchema = z.object({
  calculateDurations: z.boolean(),
  includeCosting: z.boolean(),
  costPerMinute: z.number().optional(),
});

// Integration Settings Schema
export const IntegrationSettingsSchema = z.object({
  crmSystem: z.string().optional(),
  webhookUrl: z.string().optional(),
  apiKeys: z.string().optional(),
});

// Main AI Assistant Configuration Schema
export const AIAssistantConfigSchema = z.object({
  companyInformation: CompanyInformationSchema,
  voiceAgentIdentity: VoiceAgentIdentitySchema,
  departmentStructure: DepartmentStructureSchema,
  callWorkflow: CallWorkflowSchema,
  questionSet: QuestionSetSchema,
  promptStructure: PromptStructureSchema,
  summaryRequirements: SummaryRequirementsSchema,
  outputFormatting: OutputFormattingSchema,
  costDuration: CostDurationSchema,
  integrationSettings: IntegrationSettingsSchema,
});

export type AIAssistantConfig = z.infer<typeof AIAssistantConfigSchema>;
export type CompanyInformation = z.infer<typeof CompanyInformationSchema>;
export type VoiceAgentIdentity = z.infer<typeof VoiceAgentIdentitySchema>;
export type DepartmentStructure = z.infer<typeof DepartmentStructureSchema>;
export type CallWorkflow = z.infer<typeof CallWorkflowSchema>;
export type QuestionSet = z.infer<typeof QuestionSetSchema>;
export type PromptStructure = z.infer<typeof PromptStructureSchema>;
export type SummaryRequirements = z.infer<typeof SummaryRequirementsSchema>;
export type OutputFormatting = z.infer<typeof OutputFormattingSchema>;
export type CostDuration = z.infer<typeof CostDurationSchema>;
export type IntegrationSettings = z.infer<typeof IntegrationSettingsSchema>;

// Constants for form options
export const INDUSTRY_TYPES = [
  "Manufacturing",
  "Healthcare",
  "Technology",
  "Retail",
  "Finance",
  "Construction",
  "Education",
  "Hospitality",
  "Transportation",
  "Energy",
  "Agriculture",
  "Other"
];

export const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Italian",
  "Dutch",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Russian"
];

export const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Seoul",
  "Australia/Sydney",
  "Africa/Johannesburg"
];

export const PERSONALITIES = [
  "Professional",
  "Empathetic",
  "Concise",
  "Friendly",
  "Analytical",
  "Supportive",
  "Direct",
  "Enthusiastic"
];

export const TONE_OPTIONS = [
  "Polite",
  "Assertive",
  "Calm",
  "Warm",
  "Neutral",
  "Confident",
  "Reassuring"
];

export const ROLES = [
  "Supervisor",
  "Manager",
  "Director",
  "Team Lead",
  "Assistant Manager",
  "COO",
  "Department Head",
  "Shift Supervisor"
];

export const DEPARTMENTS = [
  "Cutting",
  "Welding",
  "Sales",
  "Production",
  "Quality Control",
  "Maintenance",
  "Shipping",
  "Receiving",
  "Assembly",
  "Packaging",
  "Inventory",
  "Customer Service"
];
