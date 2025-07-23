import { title } from "process";
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// // export const list = query({
// //     args: { limit: v.optional(v.number()), offset: v.optional(v.number()) },
// //     handler: async (ctx, { limit = 20, offset = 0 }) => {
// //         return await ctx.db.query("reports").collect()
// //     },
// // });

// // export const show = query({
// //     args: { reportId: v.id("reports") },
// //     handler: async (ctx, args) => {
// //         const report = await ctx.db.get(args.reportId);
// //         // do something with `report`
// //     },
// // });

export const create = mutation({
    args: {
        called_about: v.string(),
        cost: v.float64(),
        duration: v.float64(),
        manager_name: v.string(),
        report_id: v.id("reports"),
        status: v.string(),
        timestamp: v.string(),
    },
    handler: async (ctx, args) => {
        const newCall = await ctx.db.insert("calls", args);
        return newCall;
    }
});
