"use client";

import { isNullOrUndefined, isNumericString } from "@sindresorhus/is";

import { InfiniteSelectField } from "@/core/components/custom/InfiniteSelectField";
import { FormGrid } from "@/core/components/custom/layout/FormGrid";
import {
  FormField,
  FormFieldError,
  FormWatch,
  normalizeNumerals,
  useFormApi,
} from "@/core/components/custom/SmartForm";
import { ImageUpload } from "@/core/components/custom/UploadFields";
import { Input } from "@/core/components/ui/input";
import { Textarea } from "@/core/components/ui/textarea";
import { type CategoriesSelectResult } from "@/core/services/client/categories";
import { useRemoveImageProduct } from "@/core/services/client/products";
import { type Product } from "@/core/types/entities.types";
import { isFile, toPersianNum } from "@/core/utils/helpers";
import { type productSchema } from "@/core/validation-shema";

const MAX_IMAGES = 10;

export function ProductFields({
  categoriesSelect,
}: {
  categoriesSelect: CategoriesSelectResult;
}) {
  const form = useFormApi<typeof productSchema>();
  const removeImage = useRemoveImageProduct();

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
              step={1000}
              inputMode="numeric"
              {...field}
              min={0}
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
              step={1000}
              type="number"
              inputMode="numeric"
              {...field}
              min={0}
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
                min={0}
                placeholder="۰"
              />
            );
          }}
        </FormField>

        <FormField name="category" label="دسته‌بندی">
          {({ field }) => {
            return (
              <FormWatch name="categoryLabel">
                {(categoryLabel) => (
                  <InfiniteSelectField
                    {...categoriesSelect}
                    id={field.id}
                    value={field.value}
                    selectedLabel={
                      typeof categoryLabel === "string"
                        ? categoryLabel
                        : undefined
                    }
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              </FormWatch>
            );
          }}
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
      <FormField className="pt-3" name="images" label="آپلود تصویر">
        {({ field }) => {
          const currentImages =
            (field.value as unknown as Product["images"]) ?? [];

          const reachedMax = currentImages.length >= MAX_IMAGES;
          const slotCount = reachedMax ? MAX_IMAGES : currentImages.length + 1;

          return (
            <>
              <div className="flex max-w-100 items-center justify-start gap-5 overflow-x-auto">
                {Array.from({ length: slotCount }).map((_, i) => {
                  const id = !isFile(currentImages[i])
                    ? currentImages[i]?.id
                    : null;

                  return (
                    <ImageUpload
                      key={i}
                      value={currentImages[i] ?? null}
                      className="shrink-0"
                      onRemove={() => {
                        if (id) removeImage.mutate(id);
                      }}
                      onChange={(v) => {
                        if (isFile(v)) {
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
                  );
                })}
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
    </>
  );
}
