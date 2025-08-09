import { title } from "process";
import { httpAction, mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";

export const list = query({
    args: { limit: v.optional(v.number()), offset: v.optional(v.number()) },
    handler: async (ctx, { limit = 20, offset = 0 }) => {
        return await ctx.db.query("reports").collect()
    },
});

export const show = query({
    args: { reportId: v.id("reports") },
    handler: async (ctx, args) => {
        // Include Related calls
        const report = await ctx.db.get(args.reportId);
        const calls = await ctx.db.query("calls").filter(q => q.eq(q.field("report_id"), args.reportId)).collect();
        const callIds = calls.map(call => call._id);

        return {
            report: report,
            calls: callIds,
        }
    },
});

export const create = mutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        const newReport = await ctx.db.insert("reports", args);
        return newReport;
    }
});


// Update the PDF Url in the Report
export const setReportPDF = mutation({
    args: { id: v.id("reports"), pdfLink: v.string() },
    handler: async (ctx, args) => {
        const { id, pdfLink } = args;
        console.log(await ctx.db.get(id));

        await ctx.db.patch(id, { pdf_link: pdfLink });

    },
});