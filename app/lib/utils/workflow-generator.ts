import {
  Department,
  WorkflowConfig,
  Staff,
  VAPIWorkflow,
  FinalDepartmentObject,
  Schedule
} from "@/lib/types/departments";

export function generateVAPIWorkflow(
  department: Department,
  staff: Staff[]
): VAPIWorkflow {
  const enabledStaff = staff
    .filter(s => s.callConfig?.enabled)
    .sort((a, b) => (a.callOrder || 0) - (b.callOrder || 0));

  const callSteps = enabledStaff.map((staffMember) => {
    const config = staffMember.callConfig!;
    const escalationContacts = staff.filter(s =>
      config.escalationContacts?.includes(s.id)
    );

    // Generate script based on individual staff configuration
    const baseScript = config.customScript && config.customScript.length > 0
      ? config.customScript
      : [
        `Good morning ${staffMember.name}! This is your AI assistant calling from the ${department.name} department.`,
        config.callPurpose,
        ...config.captureFields.map(field =>
          field.required
            ? `I need to collect ${field.label.toLowerCase()} - this is required.`
            : `Can you provide information about ${field.label.toLowerCase()}?`
        ),
        config.escalationEnabled
          ? "If you need to escalate anything, just let me know."
          : ""
      ].filter(Boolean);

    const baseStep = {
      type: "call" as const,
      stepId: `call_${staffMember.id}`,
      staffMember: {
        id: staffMember.id,
        name: staffMember.name,
        phone: staffMember.phone,
        role: staffMember.position,
        callOrder: staffMember.callOrder,
      },
      params: {
        target: staffMember.phone,
        voice: "ai",
        script: baseScript,
        timeout_minutes: config.timeoutMinutes || 5,
        max_retries: config.maxRetries || 3,
        purpose: config.callPurpose,
      },
      capture: config.captureFields.map(field => ({
        field: field.name,
        label: field.label,
        type: field.type,
        required: field.required,
      })),
    };

    // Add escalation logic if enabled
    if (config.escalationEnabled && escalationContacts.length > 0) {
      return {
        ...baseStep,
        escalation: {
          enabled: true,
          reason: config.escalationReason || "",
          contacts: escalationContacts.map(contact => ({
            id: contact.id,
            name: contact.name,
            phone: contact.phone,
            role: contact.position,
          })),
          script: config.escalationScript && config.escalationScript.length > 0
            ? config.escalationScript
            : [
              `Hi ${escalationContacts[0]?.name}, ${staffMember.name} from ${department.name} has requested escalation.`,
              `Reason: ${config.escalationReason || "Issue requires attention"}`,
              "Please provide your response or instructions."
            ],
          capture: [
            {
              field: "escalation_response",
              label: "Escalation Response",
              type: "text",
              required: true,
            },
            {
              field: "escalation_approved",
              label: "Escalation Approved",
              type: "boolean",
              required: true,
            }
          ]
        }
      };
    }

    return baseStep;
  });

  // Add report generation step
  const allCaptureFields = enabledStaff.flatMap(staff =>
    staff.callConfig?.captureFields || []
  );

  const reportStep = {
    type: "report" as const,
    stepId: "generate_report",
    params: {
      fields: [
        ...allCaptureFields.map(f => f.name),
        "escalation_requested",
        "escalation_response",
        "escalation_approved"
      ].filter(Boolean),
      output: "pdf",
      storage: `reports/${department.id}/{{timestamp}}.pdf`,
      template: "department_workflow_report",
      department: {
        id: department.id,
        name: department.name,
      }
    }
  };

  return {
    name: `${department.name} Individual Staff Workflow`,
    description: `Multi-step AI workflow for ${department.name} department with individual staff configurations`,
    steps: [...callSteps, reportStep]
  };
}

export function generateFinalDepartmentObject(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  departmentData: Record<string, any>,
  staff: Staff[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  workflow: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schedule: Record<string, any>
): FinalDepartmentObject {
  const timestamp = new Date().toISOString();
  const departmentId = `dept_${Date.now()}`;
  const workflowId = `workflow_${Date.now()}`;
  const scheduleId = `schedule_${Date.now()}`;

  // Create final department object with actual data
  const department: Department = {
    id: departmentId,
    name: departmentData.name,
    description: departmentData.description,
    keyResponsibilities: departmentData.keyResponsibilities || "",
    staff: staff.map(s => ({
      ...s,
      id: s.id.startsWith('staff_') ? s.id : `staff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    })),
    workflowId: workflowId,
    scheduleId: scheduleId,
    createdAt: timestamp,
    updatedAt: timestamp,
    isActive: true,
  };

  // Create comprehensive workflow config with individual staff configurations
  const enabledStaff = staff.filter(s => s.callConfig?.enabled);
  const workflowConfig: WorkflowConfig = {
    id: workflowId,
    departmentId: departmentId,
    name: `${department.name} Individual Staff Workflow`,
    description: `AI workflow with individual configurations for ${enabledStaff.length} staff members`,
    baseType: workflow.baseType || "daily-check-in",
    callPurpose: `Multi-step workflow with individual purposes: ${enabledStaff.map(s => `${s.name}: ${s.callConfig?.callPurpose}`).join('; ')}`,
    captureFields: enabledStaff.flatMap(s => s.callConfig?.captureFields || []),
    escalation: enabledStaff.some(s => s.callConfig?.escalationEnabled) ? {
      enabled: true,
      contacts: staff.filter(s => enabledStaff.some(es => es.callConfig?.escalationContacts?.includes(s.id))),
      reason: "Individual staff escalation requirements",
    } : undefined,
    reportFields: enabledStaff.flatMap(s => s.callConfig?.captureFields || []),
    version: 1,
  };

  const scheduleConfig: Schedule = {
    id: scheduleId,
    departmentId: departmentId,
    workflowId: workflowId,
    cron: schedule.cron || "0 9 * * 1-5", // Default: 9 AM weekdays
    timeZone: schedule.timeZone || "Africa/Johannesburg",
    enabled: schedule.enabled !== false,
  };

  const vapiWorkflow = generateVAPIWorkflow(department, staff);

  return {
    department,
    workflow: workflowConfig,
    schedule: scheduleConfig,
    staffCallConfigs: staff,
    vapiWorkflow,
  };
}

export function generateVAPIFunctionCall(
  finalObject: FinalDepartmentObject
): string {
  const { department, schedule } = finalObject;
  const enabledStaff = department.staff.filter(s => s.callConfig?.enabled);

  return `
// VAPI Function Call Implementation for ${department.name}
import { VapiClient } from "@vapi-ai/sdk";

export async function execute${department.name.replace(/[^a-zA-Z0-9]/g, '')}Workflow() {
  const vapi = new VapiClient({ 
    apiKey: process.env.VAPI_API_KEY 
  });
  
  try {
    // Department Configuration
    const departmentConfig = ${JSON.stringify(department, null, 4)};
    
    // Individual Staff Call Configurations
    const staffConfigurations = ${JSON.stringify(enabledStaff.map(s => ({
    id: s.id,
    name: s.name,
    phone: s.phone,
    role: s.position,
    callOrder: s.callOrder,
    callConfig: s.callConfig,
  })), null, 4)};
    
    // Schedule Configuration
    const scheduleConfig = ${JSON.stringify(schedule, null, 4)};
    
    // Execute Individual Staff Workflows in Sequence
    const results = [];
    
    for (const staffMember of staffConfigurations) {
      console.log(\`Executing workflow for \${staffMember.name} (Order: \${staffMember.callOrder})\`);
      
      const stepResult = await vapi.workflows.executeStep({
        workflow: {
          name: \`\${departmentConfig.name} - \${staffMember.name} Call\`,
          description: staffMember.callConfig.callPurpose,
          params: {
            target: staffMember.phone,
            voice: "ai",
            script: staffMember.callConfig.customScript || [
              \`Good morning \${staffMember.name}! This is your AI assistant.\`,
              staffMember.callConfig.callPurpose,
              ...staffMember.callConfig.captureFields.map(field => 
                \`Please provide: \${field.label}\`
              )
            ],
            timeout_minutes: staffMember.callConfig.timeoutMinutes,
            max_retries: staffMember.callConfig.maxRetries,
            department_id: departmentConfig.id,
            staff_id: staffMember.id,
            call_order: staffMember.callOrder,
          },
          capture: staffMember.callConfig.captureFields,
          escalation: staffMember.callConfig.escalationEnabled ? {
            enabled: true,
            reason: staffMember.callConfig.escalationReason,
            contacts: staffMember.callConfig.escalationContacts,
          } : undefined,
        }
      });
      
      results.push({
        staffId: staffMember.id,
        staffName: staffMember.name,
        callOrder: staffMember.callOrder,
        result: stepResult,
        timestamp: new Date().toISOString(),
      });
      
      // Handle escalation if needed
      if (stepResult.escalationRequested && staffMember.callConfig.escalationEnabled) {
        console.log(\`Handling escalation for \${staffMember.name}\`);
        // Escalation logic would go here
      }
    }
    
    // Generate consolidated report
    const reportResult = await vapi.reports.generate({
      department: departmentConfig,
      results: results,
      schedule: scheduleConfig,
      timestamp: new Date().toISOString(),
      storage: \`reports/\${departmentConfig.id}/\${new Date().toISOString()}.pdf\`,
    });
    
    return {
      success: true,
      departmentId: departmentConfig.id,
      workflowId: "${finalObject.workflow.id}",
      executedSteps: results.length,
      completedAt: new Date().toISOString(),
      report: reportResult,
      individualResults: results,
    };
    
  } catch (error) {
    console.error('Workflow execution failed:', error);
    return {
      success: false,
      error: error.message,
      departmentId: departmentConfig.id,
      failedAt: new Date().toISOString(),
    };
  }
}

// Schedule Configuration for Automated Execution
export const ${department.name.replace(/[^a-zA-Z0-9]/g, '')}Schedule = {
  cron: "${schedule.cron}",
  timezone: "${schedule.timeZone}",
  enabled: ${schedule.enabled},
  workflow: execute${department.name.replace(/[^a-zA-Z0-9]/g, '')}Workflow,
};`.trim();
}
