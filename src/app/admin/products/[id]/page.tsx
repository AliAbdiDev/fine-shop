"use client";

import { useParams } from "next/navigation";

import { z } from "zod";

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
import { Input } from "@/core/components/ui/input";

const CATEGORIES = [
  { value: "electronics", label: "الکترونیک" },
  { value: "clothing", label: "پوشاک" },
  { value: "books", label: "کتاب" },
];

const productFormSchema = z.object({
  name: z.string().min(1, "نام محصول الزامی است"),
  price: z.coerce.number().positive("قیمت باید عددی مثبت باشد"),
  stock: z.coerce
    .number()
    .int("تعداد باید عدد صحیح باشد")
    .nonnegative("تعداد نمی‌تواند منفی باشد"),
  image: z.any(),
  category: z.string().min(1, "دسته‌بندی را انتخاب کنید"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  async function handleSubmit(values: ProductFormValues) {
    console.log("Form submitted:", values);
  }

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <PageTitle>ویرایش محصول</PageTitle>
          <PageDescription>
            اطلاعات محصول با شناسه {id} را ویرایش کنید.
          </PageDescription>
        </PageHeading>
      </PageHeader>

      <PageContent>
        <Form schema={productFormSchema} onSubmit={handleSubmit}>
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
                      <>
                        {value ? Number(value).toLocaleString("fa-IR") : "۰"}{" "}
                        تومان
                      </>
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

            {/* تصویر */}
            <FormField name="image" label="آدرس تصویر">
              {({ field }) => <Input type="file" {...field} />}
            </FormField>

            {/* دسته‌بندی */}
            <FormField name="category" label="دسته‌بندی">
              {({ field }) => <SelectField {...field} options={CATEGORIES} />}
            </FormField>
          </FormGrid>

          <PageFooter>
            <FormSubmit>ذخیره محصول</FormSubmit>
          </PageFooter>
          {/* دکمه ارسال */}
        </Form>
      </PageContent>
    </Page>
  );
}
