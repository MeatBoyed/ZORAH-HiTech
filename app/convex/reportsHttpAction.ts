import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
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
  const reportId = await ctx.runMutation(api.entities.reports.create, {
    ...report,
    jobs_today: BigInt(report.jobs_today), // Convert to bigint for schema
    ncrs: BigInt(report.ncrs), // Convert to bigint for schema
  });
  console.log("Created report with ID:", reportId);

  // Step 2: Insert each call + related data
  for (const call of calls) {
    const callId = await ctx.runMutation(api.entities.calls.create, {
      called_about: call.called_about,
      manager_name: call.manager_name,
      status: call.status,
      timestamp: call.timestamp,
      duration: call.duration,
      cost: call.cost,
      report_id: reportId,
    });
    console.log("Created call with ID:", callId);

    await ctx.runMutation(api.entities.transcriptions.create, {
      call_id: callId,
      full_text: call.transcription.full_text,
      timestamp: call.transcription.timestamp,
    });

    await ctx.runMutation(api.entities.summaries.create, {
      call_id: callId,
      summary_text: call.summary.summary_text,
    });
  }

  return new Response(JSON.stringify({ success: true, reportId }), {
    status: 200,
  });
},
);


export const uploadReportPDF = httpAction(async (ctx, request) => {
  // Step 1: Validate incoming data
  const reportId = new URL(request.url).searchParams.get("id");
  const blob = await request.blob();

  if (!reportId || !blob) {
    return new Response(JSON.stringify({ error: "Missing report ID and or PDF blob" }), {
      status: 400,
    });
  }
  console.log("Uploading PDF for report ID:", reportId);

  // Error Handling for failed Operations
  try {
    // Step 2: Store the file
    const storageId = await ctx.storage.store(blob);
    console.log("Stored PDF with ID:", storageId);

    // Step 3: Update the report with the PDF link
    await ctx.runMutation(api.entities.reports.setReportPDF, { id: reportId as Id<"reports">, pdfLink: storageId });
    // await ctx.runMutation(api.entities.reports.setReportPDF, { id: reportId, pdfLink: storageId });

    // Step 4: Return a response with the correct CORS headers
    return new Response(null, {
      status: 200,
      // CORS headers
      headers: new Headers({
        // e.g. https://mywebsite.com, configured on your Convex dashboard
        "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
        Vary: "origin",
      }),
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    return new Response(JSON.stringify({ error: "Failed to upload PDF" }), {
      status: 500,
    });
  }
})
