"use client";

import { CustomForm } from "@/components/ui/custom-form";
import { AI_ASSISTANT_FORM_CONFIG } from "@/lib/config/assistant-form-config";
import { AIAssistantConfigSchema, AIAssistantConfig } from "@/lib/types/assistant-config-simple";
import { toast } from "sonner";

const WEBHOOK_URL = "https://primary-production-16d21.up.railway.app/webhook/ae207070-4461-4ddb-9535-f3b847890104";

export default function AssistantConfigPage() {
  const handleSubmit = async (data: AIAssistantConfig) => {
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "zorah-ai-assistant-config",
          payload: data,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with ${res.status}`);
      }

      toast.success("Configuration submitted successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error("Failed to submit configuration", {
        description: message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Voice Assistant Setup</h1>
        <div className="mt-2 space-y-2 text-sm text-muted-foreground">
          <p>
            You’re configuring an AI Agent for a specific department. These settings determine how the
            agent will behave and respond when running daily calls and workflows for that department.
          </p>
          <p>
            Think of this as the system prompt and operating rules: the identity, tone, safety boundaries,
            data to extract, and integration targets all live here. The agent uses this configuration to
            guide conversations, escalate issues, and produce structured summaries and reports.
          </p>
        </div>
      </div>
      <CustomForm
        sections={AI_ASSISTANT_FORM_CONFIG}
        schema={AIAssistantConfigSchema}
        onSubmit={handleSubmit}
        defaultValues={{}}
      />
    </div>
  );
}

