"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Phone, ChevronDown, ChevronUp, User, Workflow } from "lucide-react";
import { DepartmentFormData, Staff } from "@/lib/types/departments";
import { Switch } from "@/components/ui/switch";

interface Step2AssignStaffProps {
  formData: DepartmentFormData;
  updateFormData: (updates: Partial<DepartmentFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const STAFF_POSITIONS = [
  "Manager",
  "Supervisor",
  "Assistant",
  "Director",
] as const;

const CAPTURE_FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Yes/No" },
  { value: "date", label: "Date" },
] as const;

export default function Step2AssignStaff({
  formData,
  updateFormData,
  onNext,
  onPrev,
}: Step2AssignStaffProps) {
  const [staff, setStaff] = useState<Staff[]>(formData.staff || []);
  const [expandedStaff, setExpandedStaff] = useState<Set<string>>(new Set());

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
        captureFields: [
          {
            name: "status_update",
            label: "Status Update",
            type: "text",
            required: true,
          }
        ],
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
    const updatedStaff = staff.filter((s: Staff) => s.id !== id);
    setStaff(updatedStaff);
    updateFormData({ staff: updatedStaff });
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    const updatedStaff = staff.map((s: Staff) =>
      s.id === id ? { ...s, ...updates } : s
    );
    setStaff(updatedStaff);
    updateFormData({ staff: updatedStaff });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateCallConfig = (staffId: string, configUpdates: any) => {
    const updatedStaff = staff.map((s: Staff) =>
      s.id === staffId
        ? { ...s, callConfig: { ...s.callConfig, ...configUpdates } }
        : s
    );
    setStaff(updatedStaff);
    updateFormData({ staff: updatedStaff });
  };

  const addCaptureField = (staffId: string) => {
    const currentFields = staff.find((s: Staff) => s.id === staffId)?.callConfig?.captureFields || [];
    const newField = {
      name: `field_${currentFields.length + 1}`,
      label: "New Field",
      type: "text" as const,
      required: false,
    };
    updateCallConfig(staffId, {
      captureFields: [...currentFields, newField]
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateCaptureField = (staffId: string, fieldIndex: number, fieldUpdates: any) => {
    const currentFields = staff.find((s: Staff) => s.id === staffId)?.callConfig?.captureFields || [];
    const updatedFields = currentFields.map((field: any, index: number) =>
      index === fieldIndex ? { ...field, ...fieldUpdates } : field
    );
    updateCallConfig(staffId, {
      captureFields: updatedFields
    });
  };

  const removeCaptureField = (staffId: string, fieldIndex: number) => {
    const currentFields = staff.find((s: Staff) => s.id === staffId)?.callConfig?.captureFields || [];
    const updatedFields = currentFields.filter((_: any, index: number) => index !== fieldIndex);
    updateCallConfig(staffId, {
      captureFields: updatedFields
    });
  };

  const toggleStaffExpanded = (staffId: string) => {
    const newExpanded = new Set(expandedStaff);
    if (newExpanded.has(staffId)) {
      newExpanded.delete(staffId);
    } else {
      newExpanded.add(staffId);
    }
    setExpandedStaff(newExpanded);
  };

  const handleNext = () => {
    // Validate that at least one staff member exists
    if (staff.length === 0) {
      alert("Please add at least one staff member");
      return;
    }

    // Validate that all staff have required fields
    const hasEmptyFields = staff.some(
      (s: Staff) => !s.name || !s.phone
    );
    if (hasEmptyFields) {
      alert("Please fill in all required fields for each staff member");
      return;
    }

    // Validate call orders are unique
    const callOrders = staff.map((s: Staff) => s.callOrder).filter(Boolean);
    const uniqueOrders = new Set(callOrders);
    if (callOrders.length !== uniqueOrders.size) {
      alert("Each staff member must have a unique call order");
      return;
    }

    // Validate that call-enabled staff have required workflow configurations
    const enabledStaff = staff.filter((s: Staff) => s.callConfig?.enabled);
    for (const member of enabledStaff) {
      if (!member.callConfig?.callPurpose) {
        alert(`Please set a call purpose for ${member.name}`);
        return;
      }
      if (!member.callConfig?.captureFields || member.callConfig.captureFields.length === 0) {
        alert(`Please add at least one capture field for ${member.name}`);
        return;
      }
    }

    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configure Staff & Individual Workflows
        </h2>
        <p className="text-gray-600">
          Add staff members and configure their individual AI workflow settings. Each staff member can have their own call purpose, data capture fields, and escalation rules.
        </p>
      </div>

      <div className="space-y-4">
        {staff.map((member: Staff, index: number) => (
          <div key={member.id} className="border rounded-lg p-4 space-y-4">
            {/* Staff Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900">
                  Staff Member {index + 1} - {member.name || "New Staff"}
                </h3>
                {member.callConfig?.enabled && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Phone className="h-3 w-3 mr-1" />
                    AI Workflow Enabled
                  </span>
                )}
              </div>
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

            {/* Basic Staff Information */}
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
                <Label htmlFor={`phone-${member.id}`}>Phone *</Label>
                <Input
                  id={`phone-${member.id}`}
                  type="tel"
                  value={member.phone}
                  onChange={(e) =>
                    updateStaff(member.id, { phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <Label htmlFor={`position-${member.id}`}>Position</Label>
                <select
                  id={`position-${member.id}`}
                  value={member.position}
                  onChange={(e) =>
                    updateStaff(member.id, { position: e.target.value as typeof STAFF_POSITIONS[number] })
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
                <Label>Enable AI Workflow</Label>
              </div>
            </div>

            {/* Individual Workflow Configuration */}
            {member.callConfig?.enabled && (
              <div className="border-t pt-4">
                <button
                  type="button"
                  onClick={() => toggleStaffExpanded(member.id)}
                  className="flex items-center justify-between w-full text-left mb-4"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Workflow className="h-4 w-4" />
                    Individual AI Workflow Configuration
                  </div>
                  {expandedStaff.has(member.id) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {expandedStaff.has(member.id) && (
                  <div className="space-y-6 pl-6 border-l-2 border-blue-100">

                    {/* Call Purpose */}
                    <div>
                      <Label>Call Purpose *</Label>
                      <Input
                        value={member.callConfig?.callPurpose || ""}
                        onChange={(e) =>
                          updateCallConfig(member.id, {
                            callPurpose: e.target.value
                          })
                        }
                        placeholder="e.g., Daily status check-in and task updates"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        What is the main purpose of calling this staff member?
                      </p>
                    </div>

                    {/* Call Settings */}
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

                    {/* Custom Script */}
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
                        Leave empty to use default workflow script based on call purpose
                      </p>
                    </div>

                    {/* Capture Fields */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label>Data Capture Fields *</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addCaptureField(member.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Field
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(member.callConfig?.captureFields || []).map((field: any, fieldIndex: number) => (
                          <div key={fieldIndex} className="flex gap-2 items-end">
                            <div className="flex-1">
                              <Label className="text-xs">Field Name</Label>
                              <Input
                                value={field.name}
                                onChange={(e) =>
                                  updateCaptureField(member.id, fieldIndex, {
                                    name: e.target.value
                                  })
                                }
                                placeholder="field_name"
                              />
                            </div>
                            <div className="flex-1">
                              <Label className="text-xs">Label</Label>
                              <Input
                                value={field.label}
                                onChange={(e) =>
                                  updateCaptureField(member.id, fieldIndex, {
                                    label: e.target.value
                                  })
                                }
                                placeholder="Field Label"
                              />
                            </div>
                            <div className="w-24">
                              <Label className="text-xs">Type</Label>
                              <select
                                value={field.type}
                                onChange={(e) =>
                                  updateCaptureField(member.id, fieldIndex, {
                                    type: e.target.value
                                  })
                                }
                                className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
                              >
                                {CAPTURE_FIELD_TYPES.map((type) => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex items-center space-x-1">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) =>
                                  updateCaptureField(member.id, fieldIndex, {
                                    required: e.target.checked
                                  })
                                }
                                className="rounded"
                              />
                              <Label className="text-xs">Required</Label>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeCaptureField(member.id, fieldIndex)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Escalation Configuration */}
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
                            <Label>Escalation Script (optional)</Label>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                              placeholder="Custom escalation script lines, one per line..."
                              value={member.callConfig?.escalationScript?.join('\n') || ''}
                              onChange={(e) =>
                                updateCallConfig(member.id, {
                                  escalationScript: e.target.value.split('\n').filter(line => line.trim())
                                })
                              }
                            />
                          </div>

                          <div>
                            <Label>Escalation Contacts</Label>
                            <div className="space-y-2">
                              {staff
                                .filter((s: Staff) => s.id !== member.id)
                                .map((contact: Staff) => (
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
