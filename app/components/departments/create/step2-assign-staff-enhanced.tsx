"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Phone, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { DepartmentFormData, Staff } from "@/lib/types/departments";
import { Switch } from "@/components/ui/switch";

interface Step2AssignStaffProps {
  formData: DepartmentFormData;
  updateFormData: (updates: Partial<DepartmentFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const STAFF_POSITIONS: Array<Staff["position"]> = [
  "Manager",
  "Supervisor",
  "Assistant",
  "Director",
];

export default function Step2AssignStaff({
  formData,
  updateFormData,
  onNext,
  onPrev,
}: Step2AssignStaffProps) {
  const [staff, setStaff] = useState<Staff[]>(formData.staff || []);
  const [expandedCallConfigs, setExpandedCallConfigs] = useState<Set<string>>(new Set());

  const addStaff = () => {
    const newStaff: Staff = {
      id: `staff_${Date.now()}`,
      name: "",
      phone: "",
      position: "Assistant",
      callOrder: staff.length + 1,
      callConfig: {
        enabled: true,
        timeoutMinutes: 5,
        maxRetries: 3,
        customScript: [],
        callPurpose: "",
        captureFields: [],
        escalationEnabled: false,
        escalationContacts: [],
        escalationReason: "",
        escalationScript: [],
      }
    };
    const updatedStaff = [...staff, newStaff];
    setStaff(updatedStaff);
    updateFormData({ staff: updatedStaff });
  };

  const removeStaff = (id: string) => {
    const updatedStaff = staff.filter((s) => s.id !== id);
    setStaff(updatedStaff);
    updateFormData({ staff: updatedStaff });
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    const updatedStaff = staff.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    setStaff(updatedStaff);
    updateFormData({ staff: updatedStaff });
  };

  const updateCallConfig = (
    staffId: string,
    configUpdates: Partial<NonNullable<Staff["callConfig"]>>
  ) => {
    const updatedStaff = staff.map((s: Staff) => {
      if (s.id !== staffId) return s;
      const existing = s.callConfig ?? {
        enabled: false,
        timeoutMinutes: 5,
        maxRetries: 3,
        customScript: [],
        callPurpose: "",
        captureFields: [],
        escalationEnabled: false,
        escalationContacts: [],
        escalationReason: "",
        escalationScript: [],
      };
      const merged = { ...existing, ...configUpdates };
      if (typeof merged.enabled === "undefined") merged.enabled = existing.enabled;
      if (typeof merged.escalationEnabled === "undefined") merged.escalationEnabled = existing.escalationEnabled;
      return { ...s, callConfig: merged };
    });
    setStaff(updatedStaff);
    updateFormData({ staff: updatedStaff });
  };

  const toggleCallConfigExpanded = (staffId: string) => {
    const newExpanded = new Set(expandedCallConfigs);
    if (newExpanded.has(staffId)) {
      newExpanded.delete(staffId);
    } else {
      newExpanded.add(staffId);
    }
    setExpandedCallConfigs(newExpanded);
  };

  const handleNext = () => {
    // Validate that at least one staff member exists
    if (staff.length === 0) {
      alert("Please add at least one staff member");
      return;
    }

    // Validate that all staff have required fields
    const hasEmptyFields = staff.some(
      (s) => !s.name || !s.phone
    );
    if (hasEmptyFields) {
      alert("Please fill in all required fields for each staff member");
      return;
    }

    // Validate call orders are unique
    const callOrders = staff.map(s => s.callOrder).filter(Boolean);
    const uniqueOrders = new Set(callOrders);
    if (callOrders.length !== uniqueOrders.size) {
      alert("Each staff member must have a unique call order");
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Assign Staff Members
        </h2>
        <p className="text-gray-600">
          Add staff members and configure their individual call settings for the AI workflow.
        </p>
      </div>

      <div className="space-y-4">
        {staff.map((member, index) => (
          <div key={member.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>Staff Member {index + 1}</span>
                {member.callConfig?.enabled && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Phone className="h-3 w-3 mr-1" />
                    Call Enabled
                  </span>
                )}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeStaff(member.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`name-${member.id}`}>Name *</Label>
                <Input
                  id={`name-${member.id}`}
                  value={member.name}
                  onChange={(e) =>
                    updateStaff(member.id, { name: e.target.value })
                  }
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <Label htmlFor={`position-${member.id}`}>Position</Label>
                <select
                  id={`position-${member.id}`}
                  value={member.position}
                  onChange={(e) =>
                    updateStaff(member.id, { position: e.target.value as Staff["position"] })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STAFF_POSITIONS.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor={`callOrder-${member.id}`}>Call Order *</Label>
                <Input
                  id={`callOrder-${member.id}`}
                  type="number"
                  min="1"
                  value={member.callOrder || index + 1}
                  onChange={(e) =>
                    updateStaff(member.id, {
                      callOrder: parseInt(e.target.value) || index + 1,
                    })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={member.callConfig?.enabled || false}
                  onCheckedChange={(enabled) =>
                    updateCallConfig(member.id, { enabled })
                  }
                />
                <Label>Enable AI Calls</Label>
              </div>
            </div>

            {/* Call Configuration Section */}
            {member.callConfig?.enabled && (
              <div className="border-t pt-4">
                <div>
                  <button
                    type="button"
                    onClick={() => toggleCallConfigExpanded(member.id)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Settings className="h-4 w-4" />
                      Call Configuration
                    </div>
                    {expandedCallConfigs.has(member.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {expandedCallConfigs.has(member.id) && (
                    <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Timeout (minutes)</Label>
                          <Input
                            type="number"
                            min="1"
                            max="30"
                            value={member.callConfig?.timeoutMinutes || 5}
                            onChange={(e) =>
                              updateCallConfig(member.id, {
                                timeoutMinutes: parseInt(e.target.value) || 5
                              })
                            }
                          />
                        </div>

                        <div>
                          <Label>Max Retries</Label>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            value={member.callConfig?.maxRetries || 3}
                            onChange={(e) =>
                              updateCallConfig(member.id, {
                                maxRetries: parseInt(e.target.value) || 3
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Custom Script Lines (optional)</Label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                          placeholder="Enter custom script lines, one per line..."
                          value={member.callConfig?.customScript?.join('\n') || ''}
                          onChange={(e) =>
                            updateCallConfig(member.id, {
                              customScript: e.target.value.split('\n').filter(line => line.trim())
                            })
                          }
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Leave empty to use default workflow script
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={member.callConfig?.escalationEnabled || false}
                            onCheckedChange={(escalationEnabled) =>
                              updateCallConfig(member.id, { escalationEnabled })
                            }
                          />
                          <Label>Enable Escalation</Label>
                        </div>

                        {member.callConfig?.escalationEnabled && (
                          <div className="space-y-3 pl-6 border-l-2 border-orange-100">
                            <div>
                              <Label>Escalation Reason</Label>
                              <Input
                                placeholder="e.g., Issue requires management attention"
                                value={member.callConfig?.escalationReason || ''}
                                onChange={(e) =>
                                  updateCallConfig(member.id, {
                                    escalationReason: e.target.value
                                  })
                                }
                              />
                            </div>

                            <div>
                              <Label>Escalation Contacts</Label>
                              <div className="space-y-2">
                                {staff
                                  .filter(s => s.id !== member.id)
                                  .map(contact => (
                                    <div key={contact.id} className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        id={`escalation-${member.id}-${contact.id}`}
                                        checked={member.callConfig?.escalationContacts?.includes(contact.id) || false}
                                        onChange={(e) => {
                                          const currentContacts = member.callConfig?.escalationContacts || [];
                                          const newContacts = e.target.checked
                                            ? [...currentContacts, contact.id]
                                            : currentContacts.filter(id => id !== contact.id);
                                          updateCallConfig(member.id, {
                                            escalationContacts: newContacts
                                          });
                                        }}
                                        className="rounded border-gray-300"
                                      />
                                      <Label htmlFor={`escalation-${member.id}-${contact.id}`}>
                                        {contact.name || `Staff Member ${staff.indexOf(contact) + 1}`} ({contact.position})
                                      </Label>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addStaff}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button type="button" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
