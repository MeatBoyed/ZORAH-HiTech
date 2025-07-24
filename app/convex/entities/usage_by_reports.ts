import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const create = mutation({
    args: {
        report_id: v.id("reports"),
        billing_month: v.string(),
        call_count: v.int64(),
        cost: v.float64(),
        duration: v.float64(),
        manager: v.string(),
        report_date: v.string(), // ISO date
    },
    handler: async (ctx, args) => {
        const newUsageByReport = await ctx.db.insert("usage_by_report", args);
        return newUsageByReport;
    }
});