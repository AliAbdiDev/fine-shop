"use client";

import { useEffect } from "react";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import { isNullOrUndefined, isNumericString } from "@sindresorhus/is";
import { type z } from "zod";

import { InfiniteSelectField } from "@/core/components/custom/InfiniteSelectField";
import { FormGrid } from "@/core/components/custom/layout/FormGrid";
import {
  Page,
  PageActions,
  PageContent,
  PageDescription,
  PageFooter,
  PageHeader,
  PageHeading,
  PageTitle,
} from "@/core/components/custom/layout/Page";
import {
  Form,
  FormField,
  FormFieldError,
  FormSubmit,
  FormWatch,
  normalizeNumerals,
  useFormApi,
} from "@/core/components/custom/SmartForm";
import { ImageUpload } from "@/core/components/custom/UploadFields";
import { Input } from "@/core/components/ui/input";
import { Textarea } from "@/core/components/ui/textarea";
import { useCategoriesInfiniteSelect } from "@/core/services/client/categories";
import { useCreateProduct } from "@/core/services/client/products";
import { useBreadCrumbSelector } from "@/core/states/breadcrumb";
import { toFormData, toPersianNum } from "@/core/utils/helpers";
import { productSchema } from "@/core/validation-shema";

const ModalAttribute = dynamic(() => import("./ModalAttribute"));
type ProductFormValues = z.infer<typeof productSchema>;

const MAX_IMAGES = 10;

export default function ProductPage() {
  const create = useCreateProduct();
  const setLabel = useBreadCrumbSelector.useSetLabel();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "true";

  const title = editMode ? "ویرایش محصول" : "ایجاد محصول";

  async function handleSubmit(values: ProductFormValues) {
    const formData = toFormData(values, {
      fileKeys: ["images"],
      jsonKeys: ["attributeList"],
    });

    create.mutate(formData);
  }

  useEffect(() => {
    return setLabel("/admin/products/create-update", title);
  }, [setLabel, title]);

  return (
    <Page>
      <PageHeader forwardBack>
        <PageHeading>
          <PageTitle>{title}</PageTitle>
          <PageDescription>اطلاعات محصول را وارد کنید.</PageDescription>
        </PageHeading>
        <PageActions>
          <ModalAttribute />
        </PageActions>
      </PageHeader>

      <PageContent>
        <Form schema={productSchema} onSubmit={handleSubmit}>
          <ProductFields />
        </Form>
      </PageContent>
    </Page>
  );
}

function ProductFields() {
  const form = useFormApi<typeof productSchema>();
  const categoriesSelect = useCategoriesInfiniteSelect({ page_size: 10 });

  return (
    <>
      <FormGrid>
        <FormField name="name" label="نام محصول">
          {({ field }) => <Input {...field} placeholder="مثلاً گوشی هوشمند" />}
        </FormField>

        <FormField
          name="basePrice"
          normalize={normalizeNumerals}
          label={
            <span>
              قیمت :{" "}
              <FormWatch name="basePrice">
                {(value) => <>{toPersianNum(value)} تومان</>}
              </FormWatch>
            </span>
          }
        >
          {({ field }) => (
            <Input
              type="number"
              inputMode="numeric"
              {...field}
              placeholder="۰"
            />
          )}
        </FormField>

        <FormField
          name="discountedPrice"
          normalize={normalizeNumerals}
          label={
            <span>
              قیمت با تخفیف :{" "}
              <FormWatch name="discountedPrice">
                {(value) => <>{toPersianNum(value ?? 0)} تومان</>}
              </FormWatch>
            </span>
          }
        >
          {({ field }) => (
            <Input
              type="number"
              inputMode="numeric"
              {...field}
              placeholder="۰"
            />
          )}
        </FormField>

        <FormField
          name="stock"
          normalize={normalizeNumerals}
          emptyValue=""
          label="تعداد موجودی"
        >
          {({ field }) => {
            if (
              !isNullOrUndefined(field.value) &&
              isNumericString(field.value)
            ) {
              form.setValue("isAvailable", +field.value > 0, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }

            return (
              <Input
                type="number"
                inputMode="numeric"
                {...field}
                placeholder="۰"
              />
            );
          }}
        </FormField>

        <FormField name="category" label="دسته‌بندی">
          {({ field }) => (
            <InfiniteSelectField
              {...categoriesSelect}
              id={field.id}
              value={field.value as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        </FormField>

        <FormField name="categoryLabel" label="برچسب دسته‌بندی">
          {({ field }) => <Input {...field} placeholder="مثلاً موبایل" />}
        </FormField>

        <FormField name="description" label="توضیحات">
          {({ field }) => (
            <Textarea
              {...field}
              className="max-h-80"
              value={field.value ?? ""}
              rows={4}
              placeholder="توضیحات محصول..."
            />
          )}
        </FormField>
      </FormGrid>

      {/* ---------- images ---------- */}
      <FormField className="pt-9" name="images" label="آپلود تصویر">
        {({ field }) => {
          const currentImages = (field.value as unknown as File[]) ?? [];

          const reachedMax = currentImages.length >= MAX_IMAGES;
          const slotCount = reachedMax ? MAX_IMAGES : currentImages.length + 1;

          return (
            <>
              <div className="flex max-w-100 items-center justify-start gap-5 overflow-x-auto p-1 ps-0">
                {Array.from({ length: slotCount }).map((_, i) => (
                  <ImageUpload
                    key={i}
                    value={currentImages[i] ?? null}
                    className="shrink-0"
                    onChange={(v) => {
                      if (v instanceof File) {
                        const next = [...currentImages];
                        next[i] = v;
                        field.onChange(next);
                      } else if (v === null) {
                        field.onChange(
                          currentImages.filter((_, index) => i !== index),
                        );
                      }
                    }}
                  />
                ))}
              </div>

              <span className="text-muted-foreground text-xs">
                {toPersianNum(currentImages.length)} از{" "}
                {toPersianNum(MAX_IMAGES)}
              </span>

              {reachedMax && (
                <FormFieldError>
                  به حداکثر تعداد تصویر ({toPersianNum(MAX_IMAGES)} عدد)
                  رسیده‌اید.
                </FormFieldError>
              )}
            </>
          );
        }}
      </FormField>

      <PageFooter>
        <FormSubmit>ذخیره محصول</FormSubmit>
      </PageFooter>
    </>
  );
}
