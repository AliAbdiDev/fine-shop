"use client";

import { FormGrid } from "@/core/components/custom/layout/FormGrid";
import { FormField } from "@/core/components/custom/SmartForm";
import { ImageUpload } from "@/core/components/custom/UploadFields";
import { Input } from "@/core/components/ui/input";
import { type User } from "@/core/types/entities.types";
import { formatPhone } from "@/core/utils/helpers";

export function ProfileFields() {
  return (
    <FormGrid>
      <FormField name="firstName" label="نام">
        {({ field }) => (
          <Input {...field} placeholder="مثلاً علی" autoComplete="given-name" />
        )}
      </FormField>

      <FormField name="lastName" label="نام خانوادگی">
        {({ field }) => (
          <Input
            {...field}
            placeholder="مثلاً رضایی"
            autoComplete="family-name"
          />
        )}
      </FormField>

      <FormField name="phoneNumber" label="شماره تماس" normalize={formatPhone}>
        {({ field }) => (
          <Input
            {...field}
            dir="ltr"
            value={field.value}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            type="tel"
          />
        )}
      </FormField>

      <FormField name="avatar" label="تصویر پروفایل" className="max-w-32">
        {({ field }) => (
          <ImageUpload
            value={(field.value as User["avatar"]) ?? null}
            onChange={field.onChange}
            onRemove={() => field.onChange(null)}
          />
        )}
      </FormField>
    </FormGrid>
  );
}
