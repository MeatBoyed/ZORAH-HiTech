import { title } from "process";
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { InputCall } from "../types";

export const list = query({
    args: { limit: v.optional(v.number()), offset: v.optional(v.number()) },
    handler: async (ctx, { limit = 20, offset = 0 }) => {
        return await ctx.db.query("calls").collect()
    },
});

export const listIds = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("calls").collect().then(calls => calls.map(call => call._id));
    },
});

export const show = query({
    args: { call_id: v.id("calls") },
    handler: async (ctx, args) => {
        const call = await ctx.db.get(args.call_id);
        if (!call) {
            throw new Error("No call found with ID " + args.call_id);
        }

        const summary = await ctx.db.query("summaries").filter(q => q.eq(q.field("call_id"), args.call_id)).first();
        const transcription = await ctx.db.query("transcriptions").filter(q => q.eq(q.field("call_id"), args.call_id)).first();

        if (!summary || !transcription) {
            throw new Error(`No transcription or summary found for call ID ${args.call_id}`);
        }

        return {
            called_about: call.called_about,
            manager_name: call.manager_name,
            status: call.status,
            timestamp: call.timestamp,
            duration: call.duration,
            cost: call.cost,
            transcription: {
                full_text: transcription.full_text,
                timestamp: transcription.timestamp,
                _id: transcription._id
            },
            summary: {
                summary_text: summary.summary_text,
            },
        } as InputCall

    },
});

export const create = mutation({
    args: {
        report_id: v.id("reports"),
        called_about: v.string(),
        manager_name: v.string(),
        status: v.string(),
        timestamp: v.string(), // ISO timestamp string
        duration: v.float64(),
        cost: v.float64(),
    },
    handler: async (ctx, args) => {
        const newCall = await ctx.db.insert("calls", args);
        return newCall;
    }
});
