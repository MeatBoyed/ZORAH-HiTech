import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  calls: defineTable({
    called_about: v.string(),
    cost: v.float64(),
    duration: v.float64(),
    manager_name: v.string(),
    report_id: v.id("reports"),
    status: v.string(),
    timestamp: v.string(),
  }),
  reports: defineTable({
    date: v.string(),
    manager: v.string(),
    status: v.string(),
    summary: v.string(),
    total_cost: v.float64(),
    total_duration: v.float64(),
  }),
  summaries: defineTable({
    call_id: v.id("calls"),
    summary_text: v.string(),
  }),
  transcriptions: defineTable({
    call_id: v.id("calls"),
    full_text: v.string(),
    timestamp: v.string(),
  }),
  usage: defineTable({
    billing_month: v.string(),
    total_cost: v.float64(),
    total_usage: v.float64(),
  }),
  usage_by_call: defineTable({
    billing_month: v.string(),
    call_id: v.id("calls"),
    cost: v.float64(),
    duration: v.float64(),
    report_id: v.id("reports"),
    timestamp: v.string(),
  }),
  usage_by_report: defineTable({
    billing_month: v.string(),
    call_count: v.float64(),
    cost: v.float64(),
    duration: v.float64(),
    manager: v.string(),
    report_date: v.string(),
    report_id: v.id("reports"),
  }),
});