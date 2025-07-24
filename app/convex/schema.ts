import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { report } from "process";

export default defineSchema({
  reports: defineTable({
    _id: v.id("reports"), // unique identifier for the report
    department_name: v.string(),
    report_date: v.string(), // stored as ISO date string
    jobs_today: v.int64(),
    backlogs: v.boolean(),
    ncrs: v.int64(),
    stock_issues: v.boolean(),
    delays: v.boolean(),
    supervisor_notes: v.string(),
    manager_summary: v.string(),
    status: v.string(),
    pdf_link: v.string(),
    manager: v.string(),
    total_cost: v.float64(),
    total_duration: v.float64(),
  }),

  calls: defineTable({
    _id: v.id("calls"),
    report_id: v.id("reports"),
    called_about: v.string(),
    manager_name: v.string(),
    status: v.string(),
    timestamp: v.string(), // ISO timestamp string
    duration: v.float64(),
    cost: v.float64(),
  }),

  summaries: defineTable({
    _id: v.id("summaries"),
    call_id: v.id("calls"),
    summary_text: v.string(),
  }),

  transcriptions: defineTable({
    _id: v.id("transcriptions"),
    call_id: v.id("calls"),
    full_text: v.string(),
    timestamp: v.string(), // ISO timestamp string
  }),

  usage: defineTable({
    _id: v.id("usage"),
    billing_month: v.string(), // e.g. "2025-07"
    total_cost: v.float64(),
    total_usage: v.float64(),
  }),

  usage_by_call: defineTable({
    _id: v.id("reports"), // unique identifier for the report
    call_id: v.id("calls"),
    report_id: v.id("reports"),
    billing_month: v.string(),
    cost: v.float64(),
    duration: v.float64(),
    timestamp: v.string(), // ISO timestamp
  }),

  usage_by_report: defineTable({
    _id: v.id("reports"), // unique identifier for the report
    report_id: v.id("reports"),
    billing_month: v.string(),
    call_count: v.int64(),
    cost: v.float64(),
    duration: v.float64(),
    manager: v.string(),
    report_date: v.string(), // ISO date
  }),
});


// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values";

// export default defineSchema({
//   calls: defineTable({
//     called_about: v.string(),
//     cost: v.float64(),
//     duration: v.float64(),
//     manager_name: v.string(),
//     report_id: v.id("reports"),
//     status: v.string(),
//     timestamp: v.string(),
//   }),
//   reports: defineTable({
//     date: v.string(),
//     manager: v.string(),
//     status: v.string(),
//     summary: v.string(),
//     total_cost: v.float64(),
//     total_duration: v.float64(),
//   }),
//   summaries: defineTable({
//     call_id: v.id("calls"),
//     summary_text: v.string(),
//   }),
//   transcriptions: defineTable({
//     call_id: v.id("calls"),
//     full_text: v.string(),
//     timestamp: v.string(),
//   }),
//   usage: defineTable({
//     billing_month: v.string(),
//     total_cost: v.float64(),
//     total_usage: v.float64(),
//   }),
//   usage_by_call: defineTable({
//     billing_month: v.string(),
//     call_id: v.id("calls"),
//     cost: v.float64(),
//     duration: v.float64(),
//     report_id: v.id("reports"),
//     timestamp: v.string(),
//   }),
//   usage_by_report: defineTable({
//     billing_month: v.string(),
//     call_count: v.float64(),
//     cost: v.float64(),
//     duration: v.float64(),
//     manager: v.string(),
//     report_date: v.string(),
//     report_id: v.id("reports"),
//   }),
// });