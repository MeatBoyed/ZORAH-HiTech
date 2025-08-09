import { title } from "process";
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        call_id: v.id("calls"),
        summary_text: v.string(),
    },
    handler: async (ctx, args) => {
        const newSummary = await ctx.db.insert("summaries", args);
        return newSummary;
    }
});
