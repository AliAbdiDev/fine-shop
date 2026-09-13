"use client";

import { useState } from "react";

import { type z } from "zod";

import { FormGrid } from "@/core/components/custom/layout/FormGrid";
import {
  Page,
  PageContent,
  PageDescription,
  PageFooter,
  PageHeader,
  PageHeading,
  PageTitle,
} from "@/core/components/custom/layout/Page";
import { SelectField } from "@/core/components/custom/SelectField";
import {
  Form,
  FormField,
  FormSubmit,
  FormWatch,
} from "@/core/components/custom/SmartForm";
import { ImageUpload } from "@/core/components/custom/UploadFields";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { productSchema } from "@/core/validation-shema";

const CATEGORIES = [
  { value: "electronics", label: "الکترونیک" },
  { value: "clothing", label: "پوشاک" },
  { value: "books", label: "کتاب" },
];

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductPage() {
  const [images, setImages] = useState<Partial<unknown[]>>();

  async function handleSubmit(values: ProductFormValues) {
    console.log("Form submitted:", values);
  }

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <PageTitle>ویرایش محصول</PageTitle>
          <PageDescription>اطلاعات محصول را ویرایش کنید.</PageDescription>
        </PageHeading>
      </PageHeader>

      <PageContent>
        <Form schema={productSchema} onSubmit={handleSubmit}>
          <FormGrid>
            {/* نام محصول */}
            <FormField name="name" label="نام محصول">
              {({ field }) => (
                <Input {...field} placeholder="مثلاً گوشی هوشمند" />
              )}
            </FormField>

            {/* قیمت */}
            <FormField
              name="price"
              label={
                <span>
                  قیمت :
                  <FormWatch name="price">
                    {(value) => (
                      <>{Number(value ?? 0).toLocaleString("fa-IR")} تومان</>
                    )}
                  </FormWatch>
                </span>
              }
            >
              {({ field }) => (
                <Input type="number" step={10_000} {...field} placeholder="۰" />
              )}
            </FormField>

            {/* تعداد موجودی */}
            <FormField name="stock" label="تعداد موجودی">
              {({ field }) => (
                <Input
                  type="number"
                  {...field}
                  inputMode="numeric"
                  placeholder="۰"
                />
              )}
            </FormField>

            <FormField name="category" label="دسته‌بندی">
              {({ field }) => <SelectField {...field} options={CATEGORIES} />}
            </FormField>
          </FormGrid>

          <div className="space-y-4 pt-9">
            <Label>آپلود تصویر</Label>
            <div className="flex max-w-100 items-center justify-start gap-5 overflow-x-auto p-4">
              {Array.from({ length: 5 }).map((_, i) => {
                return (
                  <ImageUpload
                    key={i}
                    className="shrink-0"
                    onChange={(v) => {
                      setImages((prev) => {
                        if (prev !== undefined) return [...prev, v];
                      });
                    }}
                  />
                );
              })}
            </div>
          </div>

          <PageFooter>
            <FormSubmit>ذخیره محصول</FormSubmit>
          </PageFooter>
        </Form>
      </PageContent>
    </Page>
  );
}
