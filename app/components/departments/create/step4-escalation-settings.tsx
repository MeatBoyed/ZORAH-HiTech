"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkflowForm, Staff } from "@/lib/types/departments";
import { AlertTriangle, Users, Shield } from "lucide-react";

interface Step4Props {
  workflow: WorkflowForm;
  staff: Staff[];
  onUpdate: (workflow: WorkflowForm) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Step4EscalationSettings({
  workflow,
  staff,
  onUpdate,
  onNext,
  onPrevious
}: Step4Props) {

  const managers = staff.filter(s => s.position === "Manager" || s.position === "Director");

  const handleEscalationToggle = (enabled: boolean) => {
    onUpdate({
      ...workflow,
      escalationEnabled: enabled,
      escalationContacts: enabled ? workflow.escalationContacts : [],
      escalationReason: enabled ? workflow.escalationReason : "",
    });
  };

  const handleContactToggle = (staffId: string, checked: boolean) => {
    const currentContacts = workflow.escalationContacts || [];
    if (checked) {
      onUpdate({
        ...workflow,
        escalationContacts: [...currentContacts, staffId]
      });
    } else {
      onUpdate({
        ...workflow,
        escalationContacts: currentContacts.filter(id => id !== staffId)
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 4: Escalation & Callback Settings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure when and how issues should be escalated to management
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Escalation Toggle */}
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <div>
              <Label htmlFor="escalation-enabled" className="text-base font-medium">
                Enable Escalation
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow staff to escalate urgent issues during calls
              </p>
            </div>
          </div>
          <Switch
            id="escalation-enabled"
            checked={workflow.escalationEnabled}
            onCheckedChange={handleEscalationToggle}
          />
        </div>

        {/* Escalation Configuration */}
        {workflow.escalationEnabled && (
          <div className="space-y-6 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <h3 className="font-medium">Escalation Configuration</h3>
            </div>

            {/* Escalation Reason/Prompt */}
            <div className="space-y-2">
              <Label htmlFor="escalation-reason">Escalation Guidelines</Label>
              <Textarea
                id="escalation-reason"
                value={workflow.escalationReason || ""}
                onChange={(e) => onUpdate({ ...workflow, escalationReason: e.target.value })}
                placeholder="Describe when escalation should occur (e.g., 'Escalate for critical safety issues, project delays over 2 days, or budget overruns exceeding 10%')"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This helps the AI understand when to offer escalation options to staff
              </p>
            </div>

            {/* Escalation Contacts */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <Label>Who should receive escalations?</Label>
              </div>

              {managers.length === 0 ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ No managers or directors found. Please add management staff in Step 2 to configure escalations.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {managers.map((manager) => (
                    <div key={manager.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                      <Checkbox
                        id={`contact-${manager.id}`}
                        checked={(workflow.escalationContacts || []).includes(manager.id)}
                        onCheckedChange={(checked) => handleContactToggle(manager.id, checked as boolean)}
                      />
                      <label htmlFor={`contact-${manager.id}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium
                            ${manager.position === 'Manager' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                              'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            }`}
                          >
                            {manager.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{manager.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {manager.position} • {manager.phone}
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Escalation Process Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                How Escalation Works
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Staff can request escalation during their call</li>
                <li>• Selected managers will receive immediate notifications</li>
                <li>• Escalated issues are highlighted in reports</li>
                <li>• Follow-up actions can be tracked and managed</li>
              </ul>
            </div>
          </div>
        )}

        {/* No Escalation Message */}
        {!workflow.escalationEnabled && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Escalation is disabled for this workflow</p>
            <p className="text-sm">Enable escalation above to configure notification settings</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrevious}>
            Previous: Configure Workflow
          </Button>
          <Button onClick={onNext}>
            Next: Schedule Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
