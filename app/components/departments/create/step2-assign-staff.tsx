"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StaffForm, Staff } from "@/lib/types/departments";
import { Trash2, Plus, Users, UserCheck } from "lucide-react";

interface Step2Props {
  staff: Staff[];
  onUpdate: (staff: Staff[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Step2AssignStaff({ staff, onUpdate, onNext, onPrevious }: Step2Props) {
  const [newStaff, setNewStaff] = useState<StaffForm>({
    name: "",
    phone: "",
    position: "Assistant"
  });
  const [errors, setErrors] = useState<Partial<StaffForm>>({});

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: Partial<StaffForm> = {};
    if (!newStaff.name?.trim()) {
      newErrors.name = "Name is required";
    }
    if (!newStaff.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check for duplicate phone numbers
    if (staff.some(s => s.phone === newStaff.phone)) {
      setErrors({ phone: "This phone number is already used" });
      return;
    }

    // Add staff member
    const staffMember: Staff = {
      id: `staff_${Date.now()}`, // Generate temporary ID
      ...newStaff,
      callConfig: {
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
      }
    };

    onUpdate([...staff, staffMember]);
    setNewStaff({ name: "", phone: "", position: "Assistant" });
    setErrors({});
  };

  const handleRemoveStaff = (staffId: string) => {
    onUpdate(staff.filter(s => s.id !== staffId));
  };

  const handleNext = () => {
    if (staff.length === 0) {
      alert("Please add at least one staff member before proceeding");
      return;
    }

    // Check if there's at least one manager
    const hasManager = staff.some(s => s.position === "Manager");
    if (!hasManager) {
      alert("Please assign at least one Manager to the department");
      return;
    }

    onNext();
  };

  const handleInputChange = (field: keyof StaffForm, value: string) => {
    setNewStaff({ ...newStaff, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Assign Staff</CardTitle>
        <p className="text-sm text-muted-foreground">
          Add staff members with their contact information and roles
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Staff Form */}
        <div className="border border-border rounded-lg p-4">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Staff Member
          </h3>
          <form onSubmit={handleAddStaff} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="staff-name">Name *</Label>
                <Input
                  id="staff-name"
                  value={newStaff.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Full name"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff-phone">Phone Number *</Label>
                <Input
                  id="staff-phone"
                  value={newStaff.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+27-XX-XXX-XXXX"
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="staff-position">Position *</Label>
              <Select
                value={newStaff.position}
                onValueChange={(value) => handleInputChange("position", value)}
              >
                <SelectTrigger id="staff-position">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Assistant">Assistant</SelectItem>
                  <SelectItem value="Director">Director</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </form>
        </div>

        {/* Staff List */}
        {staff.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Department Staff ({staff.length})
            </h3>

            <div className="space-y-3">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium
                      ${member.position === 'Manager' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                        member.position === 'Supervisor' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                          member.position === 'Director' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                      }`}
                    >
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.position} • {member.phone}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveStaff(member.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Validation Messages */}
            {staff.length > 0 && !staff.some(s => s.position === "Manager") && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Please assign at least one Manager to this department
                </p>
              </div>
            )}
          </div>
        )}

        {staff.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No staff members added yet</p>
            <p className="text-sm">Add staff members using the form above</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrevious}>
            Previous: Department Details
          </Button>
          <Button onClick={handleNext}>
            Next: Configure Workflow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
