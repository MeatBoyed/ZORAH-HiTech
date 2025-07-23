import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { ReportInputSchema } from "./types";
import { v } from "convex/values";

export const postReport = httpAction(async (ctx, req) => {
  const body = await req.json();
  console.log("Received report data:", body);
  const parsed = ReportInputSchema.safeParse(body);

  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Invalid request", details: parsed.error }),
      { status: 400 }
    );
  }

  const { report, calls } = parsed.data;
  console.log("Parsed report data:", report, calls);

  // Step 1: Create the Report
  const reportId = await ctx.runMutation(api.entities.reports.create, report);
  console.log("Created report with ID:", reportId);


  // Step 2: Insert each call + related data
  for (const call of calls) {
    const callId = await ctx.runMutation(api.entities.calls.create, {
      timestamp: call.timestamp,
      manager_name: call.manager_name,
      called_about: call.called_about,
      status: call.status,
      duration: call.duration,
      cost: call.cost,
      report_id: reportId,
    });
    console.log("Created call with ID:", callId);

    const transcriptionId = await ctx.runMutation(api.entities.transcriptions.create, {
      call_id: callId,
      full_text: call.transcription.full_text,
      timestamp: call.transcription.timestamp,
    });
    console.log("Created transcription with ID:", transcriptionId);

    const summaryId = await ctx.runMutation(api.entities.summaries.create, {
      call_id: callId,
      summary_text: call.summary.summary_text,
    });
    console.log("Created summary with ID:", summaryId);
  }

  return new Response(JSON.stringify({ success: true, reportId }), {
    status: 200,
  });

});
