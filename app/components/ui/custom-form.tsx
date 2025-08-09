"use client";

import React, { useState } from "react";
import { useForm, UseFormReturn, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FormFieldConfig, FormSectionConfig } from "@/lib/types/assistant-config-simple";
import { z } from "zod";

interface CustomFormProps {
    sections: FormSectionConfig[];
    schema: z.ZodSchema<any>;
    onSubmit: (data: any) => void;
    defaultValues?: Record<string, any>;
    isSubmitting?: boolean;
}

interface FormFieldProps {
    field: FormFieldConfig;
    form: UseFormReturn<any>;
    watchedValues?: any;
}

function FormFieldComponent({ field, form, watchedValues }: FormFieldProps) {
    const watchedValue = watchedValues?.[field.name];

    const renderField = () => {
        switch (field.type) {
            case "text":
            case "email":
                return (
                    <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        {...form.register(field.name)}
                    />
                );

            case "number":
                return (
                    <Input
                        type="number"
                        placeholder={field.placeholder}
                        step={field.step}
                        min={field.min}
                        max={field.max}
                        {...form.register(field.name, {
                            valueAsNumber: true,
                            setValueAs: (value) => value === "" ? undefined : Number(value)
                        })}
                    />
                );

            case "time":
                return (
                    <Input
                        type="time"
                        {...form.register(field.name)}
                    />
                );

            case "textarea":
                return (
                    <Textarea
                        placeholder={field.placeholder}
                        className="min-h-24"
                        {...form.register(field.name)}
                    />
                );

            case "select":
                return (
                    <>
                        {/* Register the field with RHF to ensure validation & form state */}
                        <input type="hidden" {...form.register(field.name)} />
                        <Select
                            onValueChange={(value) => form.setValue(field.name, value, { shouldValidate: true, shouldDirty: true })}
                            defaultValue={watchedValue}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={field.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </>
                );

            case "multiselect":
                const selectedValues = watchedValue || [];
                const availableOptions = field.name === "callOrder"
                    ? (field.options?.filter(opt => watchedValues?.rolesToContact?.includes(opt.value)) || [])
                    : field.name === "dailyCallDepartments"
                        ? (field.options?.filter(opt => watchedValues?.departments?.includes(opt.value)) || [])
                        : field.options || [];

                return (
                    <div className="space-y-3">
                        {/* Register array field so RHF tracks and validates */}
                        <input type="hidden" {...form.register(field.name)} />
                        {availableOptions.length === 0 && field.name !== "departments" && field.name !== "rolesToContact" && (
                            <p className="text-sm text-muted-foreground">
                                Please select {field.name === "callOrder" ? "roles to contact" : field.name === "dailyCallDepartments" ? "departments" : "options"} first.
                            </p>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {(field.name === "departments" || field.name === "rolesToContact" ? field.options : availableOptions)?.map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${field.name}-${option.value}`}
                                        checked={selectedValues.includes(option.value)}
                                        onCheckedChange={(checked) => {
                                            const currentValues = selectedValues;
                                            let newValues;

                                            if (checked) {
                                                newValues = [...currentValues, option.value];
                                            } else {
                                                newValues = currentValues.filter((v: string) => v !== option.value);

                                                // Clean up dependent fields
                                                if (field.name === "departments") {
                                                    const currentDailyCall = watchedValues?.dailyCallDepartments || [];
                                                    form.setValue("dailyCallDepartments", currentDailyCall.filter((v: string) => v !== option.value));
                                                } else if (field.name === "rolesToContact") {
                                                    const currentCallOrder = watchedValues?.callOrder || [];
                                                    const currentReportRecipients = watchedValues?.reportRecipients || [];
                                                    form.setValue("callOrder", currentCallOrder.filter((v: string) => v !== option.value));
                                                    form.setValue("reportRecipients", currentReportRecipients.filter((v: string) => v !== option.value));
                                                }
                                            }

                                            form.setValue(field.name, newValues, { shouldValidate: true, shouldDirty: true });
                                        }}
                                    />
                                    <label
                                        htmlFor={`${field.name}-${option.value}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {selectedValues.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {selectedValues.map((value: string) => {
                                    const option = field.options?.find(opt => opt.value === value);
                                    return option ? (
                                        <Badge key={value} variant="secondary">
                                            {option.label}
                                        </Badge>
                                    ) : null;
                                })}
                            </div>
                        )}
                    </div>
                );

            case "checkbox":
                return (
                    <div className="flex items-center space-x-2">
                        {/* Register boolean field */}
                        <input type="hidden" {...form.register(field.name)} />
                        <Checkbox
                            id={field.name}
                            checked={watchedValue || false}
                            onCheckedChange={(checked) => form.setValue(field.name, !!checked, { shouldValidate: true, shouldDirty: true })}
                        />
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {field.label}
                        </label>
                    </div>
                );

            case "radio":
                return (
                    <div className="flex gap-6">
                        {/* Register radio field */}
                        <input type="hidden" {...form.register(field.name)} />
                        {field.options?.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id={`${field.name}-${option.value}`}
                                    value={option.value}
                                    checked={watchedValue === option.value}
                                    onChange={(e) => form.setValue(field.name, e.target.value, { shouldValidate: true, shouldDirty: true })}
                                    className="w-4 h-4"
                                />
                                <label
                                    htmlFor={`${field.name}-${option.value}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                );

            default:
                return <Input placeholder={field.placeholder} {...form.register(field.name)} />;
        }
    };

    if (field.type === "checkbox") {
        return (
            <FormField
                control={form.control}
                name={field.name}
                render={() => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                            {renderField()}
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            {field.description && (
                                <FormDescription>{field.description}</FormDescription>
                            )}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    }

    return (
        <FormField
            control={form.control}
            name={field.name}
            render={() => (
                <FormItem className="space-y-2">
                    {field.type !== "checkbox" && (
                        <FormLabel>
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        {renderField()}
                    </FormControl>
                    {field.description && (
                        <FormDescription>{field.description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function CustomForm({ sections, schema, onSubmit, defaultValues, isSubmitting = false }: CustomFormProps) {
    const [openSections, setOpenSections] = useState<Set<number>>(new Set([0])); // First section open by default

    const form = useForm<any>({
        // Type cast is required due to @hookform/resolvers types expecting Zod v3 while project uses Zod v4
        resolver: (zodResolver as any)(schema as any) as any,
        defaultValues: defaultValues || {},
    });

    const watchedValues = form.watch();

    const toggleSection = (index: number) => {
        const newOpenSections = new Set(openSections);
        if (newOpenSections.has(index)) {
            newOpenSections.delete(index);
        } else {
            newOpenSections.add(index);
        }
        setOpenSections(newOpenSections);
    };

    const handleSubmit = (data: any) => {
        onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                {sections.map((section, sectionIndex) => (
                    <Card key={sectionIndex}>
                        <Collapsible
                            open={openSections.has(sectionIndex)}
                            onOpenChange={() => toggleSection(sectionIndex)}
                        >
                            <CollapsibleTrigger asChild>
                                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{section.title}</CardTitle>
                                            <CardDescription>{section.description}</CardDescription>
                                        </div>
                                        {openSections.has(sectionIndex) ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </div>
                                </CardHeader>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                        {section.fields.map((field, fieldIndex) => (
                                            <div
                                                key={fieldIndex}
                                                className={(field.type === "textarea" || field.type === "multiselect") ? "md:col-span-2" : ""}
                                            >
                                                <FormFieldComponent
                                                    field={field}
                                                    form={form}
                                                    watchedValues={watchedValues}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                ))}

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="min-w-32">
                        {isSubmitting ? "Submitting..." : "Submit Configuration"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
