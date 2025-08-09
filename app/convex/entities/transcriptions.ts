import { title } from "process";
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const show = query({
    args: { transcriptionId: v.id("transcriptions") },
    handler: async (ctx, args) => {
        const transcription = await ctx.db.get(args.transcriptionId);
        if (!transcription) {
            throw new Error("No transcription found with ID " + args.transcriptionId);
        }
        const call = await ctx.db.query("calls").filter(q => q.eq(q.field("_id"), transcription.call_id)).first();
        return {
            transcription: transcription,
            call: call
        };
    }
});

export const create = mutation({
    args: {
        call_id: v.id("calls"),
        full_text: v.string(),
        timestamp: v.string(),
    },
    handler: async (ctx, args) => {
        const newTranscription = await ctx.db.insert("transcriptions", args);
        return newTranscription;
    }
});
