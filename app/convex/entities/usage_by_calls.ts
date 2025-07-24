import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const create = mutation({
    args: {
        call_id: v.id("calls"),
        report_id: v.id("reports"),
        billing_month: v.string(),
        cost: v.float64(),
        duration: v.float64(),
        timestamp: v.string(), // ISO timestamp
    },
    handler: async (ctx, args) => {
        const newUsageByCall = await ctx.db.insert("usage_by_call", args);
        return newUsageByCall;
    }
});