"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScheduleForm } from "@/lib/types/departments";
import { Clock, Calendar, Globe, Play, Pause } from "lucide-react";

interface Step5Props {
  schedule: ScheduleForm;
  onUpdate: (schedule: ScheduleForm) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Step5ScheduleSettings({
  schedule,
  onUpdate,
  onNext,
  onPrevious
}: Step5Props) {

  const [selectedDays, setSelectedDays] = useState<string[]>(() => {
    // Parse existing cron to extract days if any
    if (schedule.cron && schedule.cron !== "manual") {
      // Simple parsing - this could be more robust
      if (schedule.cron.includes("1,2,3,4,5")) return ["1", "2", "3", "4", "5"];
      if (schedule.cron.includes("1,3,5")) return ["1", "3", "5"];
      if (schedule.cron.includes("*")) return ["0", "1", "2", "3", "4", "5", "6"];
    }
    return ["1", "2", "3", "4", "5"]; // Default to weekdays
  });

  const [selectedHour, setSelectedHour] = useState(() => {
    // Parse existing cron to extract hour if any
    if (schedule.cron && schedule.cron !== "manual") {
      const parts = schedule.cron.split(" ");
      if (parts.length >= 2) {
        return parts[1] || "8";
      }
    }
    return "8"; // Default to 8 AM
  });

  const [selectedMinute, setSelectedMinute] = useState(() => {
    // Parse existing cron to extract minute if any
    if (schedule.cron && schedule.cron !== "manual") {
      const parts = schedule.cron.split(" ");
      if (parts.length >= 1) {
        return parts[0] || "0";
      }
    }
    return "0"; // Default to :00
  });

  const [isManual, setIsManual] = useState(schedule.cron === "manual");

  const dayLabels = {
    "0": "Sunday",
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday"
  };

  const timeZones = [
    "Africa/Johannesburg",
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Australia/Sydney"
  ];

  const generateCron = () => {
    if (isManual) return "manual";

    const minute = selectedMinute;
    const hour = selectedHour;
    const dayOfWeek = selectedDays.length === 7 ? "*" : selectedDays.join(",");

    return `${minute} ${hour} * * ${dayOfWeek}`;
  };

  const handleDayToggle = (day: string, checked: boolean) => {
    let newDays;
    if (checked) {
      newDays = [...selectedDays, day].sort();
    } else {
      newDays = selectedDays.filter(d => d !== day);
    }
    setSelectedDays(newDays);

    // Update cron
    const newCron = isManual ? "manual" : `${selectedMinute} ${selectedHour} * * ${newDays.length === 7 ? "*" : newDays.join(",")}`;
    onUpdate({ ...schedule, cron: newCron });
  };

  const handleTimeChange = (hour?: string, minute?: string) => {
    const newHour = hour || selectedHour;
    const newMinute = minute || selectedMinute;

    if (hour) setSelectedHour(hour);
    if (minute) setSelectedMinute(minute);

    if (!isManual) {
      const dayOfWeek = selectedDays.length === 7 ? "*" : selectedDays.join(",");
      const newCron = `${newMinute} ${newHour} * * ${dayOfWeek}`;
      onUpdate({ ...schedule, cron: newCron });
    }
  };

  const handleManualToggle = (manual: boolean) => {
    setIsManual(manual);
    onUpdate({
      ...schedule,
      cron: manual ? "manual" : generateCron()
    });
  };

  const handleNext = () => {
    if (!schedule.timeZone) {
      alert("Please select a timezone");
      return;
    }

    if (!isManual && selectedDays.length === 0) {
      alert("Please select at least one day for scheduled calls");
      return;
    }

    onNext();
  };

  const getScheduleDescription = () => {
    if (isManual) {
      return "Calls will be triggered manually by users";
    }

    if (selectedDays.length === 0) {
      return "No schedule configured";
    }

    const dayNames = selectedDays.map(d => dayLabels[d as keyof typeof dayLabels]);
    const timeStr = `${selectedHour.padStart(2, '0')}:${selectedMinute.padStart(2, '0')}`;

    if (selectedDays.length === 7) {
      return `Daily at ${timeStr}`;
    } else if (selectedDays.join(",") === "1,2,3,4,5") {
      return `Weekdays at ${timeStr}`;
    } else {
      return `${dayNames.join(", ")} at ${timeStr}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 5: Schedule Settings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure when the workflow should automatically run
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manual vs Automatic Toggle */}
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <Label htmlFor="manual-trigger" className="text-base font-medium">
                Manual Triggering Only
              </Label>
              <p className="text-sm text-muted-foreground">
                Disable automatic scheduling - calls will only be triggered manually
              </p>
            </div>
          </div>
          <Switch
            id="manual-trigger"
            checked={isManual}
            onCheckedChange={handleManualToggle}
          />
        </div>

        {/* Automatic Schedule Configuration */}
        {!isManual && (
          <div className="space-y-6 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <h3 className="font-medium">Automatic Schedule</h3>
            </div>

            {/* Days Selection */}
            <div className="space-y-3">
              <Label>Select Days</Label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {Object.entries(dayLabels).map(([value, label]) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${value}`}
                      checked={selectedDays.includes(value)}
                      onCheckedChange={(checked) => handleDayToggle(value, checked as boolean)}
                    />
                    <label htmlFor={`day-${value}`} className="text-sm cursor-pointer">
                      {label.slice(0, 3)}
                    </label>
                  </div>
                ))}
              </div>

              {/* Quick Day Selections */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const weekdays = ["1", "2", "3", "4", "5"];
                    setSelectedDays(weekdays);
                    onUpdate({ ...schedule, cron: `${selectedMinute} ${selectedHour} * * ${weekdays.join(",")}` });
                  }}
                >
                  Weekdays
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const allDays = ["0", "1", "2", "3", "4", "5", "6"];
                    setSelectedDays(allDays);
                    onUpdate({ ...schedule, cron: `${selectedMinute} ${selectedHour} * * *` });
                  }}
                >
                  Every Day
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedDays([]);
                    onUpdate({ ...schedule, cron: `${selectedMinute} ${selectedHour} * * ` });
                  }}
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hour">Hour</Label>
                <Select
                  value={selectedHour}
                  onValueChange={(hour) => handleTimeChange(hour)}
                >
                  <SelectTrigger id="hour">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, '0')}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minute">Minute</Label>
                <Select
                  value={selectedMinute}
                  onValueChange={(minute) => handleTimeChange(undefined, minute)}
                >
                  <SelectTrigger id="minute">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["0", "15", "30", "45"].map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        :{minute.padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Timezone Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <Label htmlFor="timezone">Timezone *</Label>
          </div>
          <Select
            value={schedule.timeZone || ""}
            onValueChange={(tz) => onUpdate({ ...schedule, timeZone: tz })}
          >
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {timeZones.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Enable/Disable Schedule */}
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center gap-3">
            {schedule.enabled ? (
              <Play className="h-5 w-5 text-green-500" />
            ) : (
              <Pause className="h-5 w-5 text-orange-500" />
            )}
            <div>
              <Label htmlFor="schedule-enabled" className="text-base font-medium">
                {schedule.enabled ? "Schedule Enabled" : "Schedule Disabled"}
              </Label>
              <p className="text-sm text-muted-foreground">
                {schedule.enabled
                  ? "The workflow will run automatically according to the schedule"
                  : "The workflow is configured but won't run automatically"
                }
              </p>
            </div>
          </div>
          <Switch
            id="schedule-enabled"
            checked={schedule.enabled}
            onCheckedChange={(enabled) => onUpdate({ ...schedule, enabled })}
          />
        </div>

        {/* Schedule Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Schedule Summary
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {getScheduleDescription()}
            {schedule.timeZone && ` (${schedule.timeZone})`}
          </p>
          {!isManual && schedule.cron && (
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1 font-mono">
              Cron: {schedule.cron}
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrevious}>
            Previous: Escalation Settings
          </Button>
          <Button onClick={handleNext}>
            Next: Review & Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
