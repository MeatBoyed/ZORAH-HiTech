import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: { limit: v.optional(v.number()), offset: v.optional(v.number()) },
    handler: async (ctx, { limit = 20, offset = 0 }) => {
        return await ctx.db.query("reports").order("desc").take(limit);
    },
});

export const show = query({
    args: { reportId: v.id("reports") },
    handler: async (ctx, args) => {
        const report = await ctx.db.get(args.reportId);
        // do something with `report`
    },
});