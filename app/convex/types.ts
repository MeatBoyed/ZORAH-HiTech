import z from "zod";

// Simplified individual schemas
export const ReportSchema = z.object({
    department_name: z.string(),
    report_date: z.string(), // ISO date string
    jobs_today: z.number(), // Changed from bigint for simplicity
    backlogs: z.boolean(),
    ncrs: z.number(), // Changed from bigint for simplicity
    stock_issues: z.boolean(),
    delays: z.boolean(),
    supervisor_notes: z.string(),
    manager_summary: z.string(),
    status: z.string(),
    pdf_link: z.string(),
    manager: z.string(),
    total_cost: z.number(),
    total_duration: z.number(),
});

export const CallSchema = z.object({
    called_about: z.string(),
    manager_name: z.string(),
    status: z.string(),
    timestamp: z.string(), // ISO timestamp string
    duration: z.number(),
    cost: z.number(),
    transcription: z.object({
        full_text: z.string(),
        timestamp: z.string(),
    }),
    summary: z.object({
        summary_text: z.string(),
    }),
});

// Simplified HTTP payload - just report and calls
export const ReportInputSchema = z.object({
    report: ReportSchema,
    calls: z.array(CallSchema),
});
// import { z } from "zod";

// // Individual table schemas that match your Convex database schema
// export const ReportSchema = z.object({
//     department_name: z.string(),
//     report_date: z.string(), // ISO date string
//     jobs_today: z.bigint(),
//     backlogs: z.boolean(),
//     ncrs: z.bigint(),
//     stock_issues: z.boolean(),
//     delays: z.boolean(),
//     supervisor_notes: z.string(),
//     manager_summary: z.string(),
//     status: z.string(),
//     pdf_link: z.string(),
//     manager: z.string(),
//     total_cost: z.number(),
//     total_duration: z.number(),
// });

// export const CallSchema = z.object({
//     called_about: z.string(),
//     manager_name: z.string(),
//     status: z.string(),
//     timestamp: z.string(), // ISO timestamp string
//     duration: z.number(),
//     cost: z.number(),
// });

// export const SummarySchema = z.object({
//     summary_text: z.string(),
// });

// export const TranscriptionSchema = z.object({
//     full_text: z.string(),
//     timestamp: z.string(), // ISO timestamp string
// });

// export const UsageSchema = z.object({
//     billing_month: z.string(), // e.g. "2025-07"
//     total_cost: z.number(),
//     total_usage: z.number(),
// });

// export const UsageByCallSchema = z.object({
//     billing_month: z.string(),
//     cost: z.number(),
//     duration: z.number(),
//     timestamp: z.string(), // ISO timestamp
// });

// export const UsageByReportSchema = z.object({
//     billing_month: z.string(),
//     call_count: z.bigint(),
//     cost: z.float64(),
//     duration: z.float64(),
//     manager: z.string(),
//     report_date: z.string(), // ISO date
// });

// // Nested schemas for HTTP payload
// export const CallWithDataSchema = z.object({
//     timestamp: z.string(),
//     manager_name: z.string(),
//     called_about: z.string(),
//     status: z.string(),
//     duration: z.number(),
//     cost: z.number(),
//     transcription: TranscriptionSchema,
//     summary: SummarySchema,
// });

// // Complete HTTP POST payload schema
// export const ReportInputSchema = z.object({
//     report: ReportSchema,
//     calls: z.array(CallWithDataSchema),
//     usage: UsageSchema,
//     usage_by_report: UsageByReportSchema,
// });
