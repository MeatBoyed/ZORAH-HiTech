// src/api/types.ts
import { z } from "zod";

export const ReportInputSchema = z.object({
    report: z.object({
        date: z.string(), // e.g., "2025-07-20"
        manager: z.string(),
        status: z.string(),
        summary: z.string(),
        total_cost: z.number(),
        total_duration: z.number(),
    }),
    calls: z.array(
        z.object({
            timestamp: z.string(),
            manager_name: z.string(),
            called_about: z.string(),
            status: z.string(),
            duration: z.number(),
            cost: z.number(),
            transcription: z.object({
                full_text: z.string(),
                timestamp: z.string(),
            }),
            summary: z.object({
                summary_text: z.string(),
            }),
        })
    ),
});
