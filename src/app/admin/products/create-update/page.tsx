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
import {
  type CategoriesSelectResult,
  useCategoriesInfiniteSelect,
} from "@/core/services/client/categories";
import {
  useCreateProduct,
  useEditProduct,
  useProduct,
  useRemoveImageProduct,
} from "@/core/services/client/products";
import { useBreadCrumbSelector } from "@/core/states/breadcrumb";
import { useProductAttributeSelector } from "@/core/states/productAttribute";
import { type Product } from "@/core/types/entities.types";
import { toFormData, toPersianNum } from "@/core/utils/helpers";
import { productSchema } from "@/core/validation-shema";

const ModalAttribute = dynamic(() => import("./ModalAttribute"));
type ProductFormValues = z.infer<typeof productSchema>;

const MAX_IMAGES = 10;

export default function ProductPage() {
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "true";
  const id = Number(searchParams.get("id"));

  const setLabel = useBreadCrumbSelector.useSetLabel();
  const attributes = useProductAttributeSelector.useAtts();

  const create = useCreateProduct();
  const edit = useEditProduct({ id });

  const categories = useCategoriesInfiniteSelect({
    pageSize: 10,
  });

  const { isFetched: _r, ...categoriesSelect } = categories;
  const getProduct = useProduct({
    id,
    enabled: editMode && categories.isFetched,
  });

  const title = editMode ? "ویرایش محصول" : "ایجاد محصول";

  async function handleSubmit(values: ProductFormValues) {
    const formData = toFormData(
      { ...values, attributeList: attributes } as ProductFormValues,
      {
        fileKeys: ["images"],
        jsonKeys: ["attributeList"],
      },
    );

    (editMode ? edit : create).mutate(formData);
  }

  useEffect(
    () => setLabel("/admin/products/create-update", title),
    [setLabel, title],
  );

  const productData = getProduct.data?.data;

  return (
    <Page isLoading={getProduct.isPending && editMode}>
      <PageHeader forwardBack>
        <PageHeading>
          <PageTitle>{title}</PageTitle>
          <PageDescription>اطلاعات محصول را وارد کنید.</PageDescription>
        </PageHeading>
        <PageActions>
          <ModalAttribute initAttributes={productData?.attributeList} />
        </PageActions>
      </PageHeader>

      <PageContent>
        <Form
          schema={productSchema}
          onSubmit={handleSubmit}
          defaultValues={{
            ...productData,
            images: productData?.images,
          }}
        >
          <ProductFields categoriesSelect={categoriesSelect} />

          <PageFooter>
            <FormSubmit loading={create.isPending}>ذخیره محصول</FormSubmit>
          </PageFooter>
        </Form>
      </PageContent>
    </Page>
  );
}

function ProductFields({
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
      <FormField className="pt-9" name="images" label="آپلود تصویر">
        {({ field }) => {
          const currentImages =
            (field.value as unknown as Product["images"]) ?? [];

          const reachedMax = currentImages.length >= MAX_IMAGES;
          const slotCount = reachedMax ? MAX_IMAGES : currentImages.length + 1;

          return (
            <>
              <div className="flex max-w-100 items-center justify-start gap-5 overflow-x-auto p-1 ps-0">
                {Array.from({ length: slotCount }).map((_, i) => {
                  const id = !(currentImages[i] instanceof File)
                    ? currentImages[i]?.id
                    : null;

                  return (
                    <ImageUpload
                      key={i}
                      value={currentImages[i] ?? null}
                      className="shrink-0"
                      onRemove={() => {
                        console.log("🚀 ~ ProductFields ~ id:", id);
                        if (id) {
                          removeImage.mutate(id);
                        }
                      }}
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
