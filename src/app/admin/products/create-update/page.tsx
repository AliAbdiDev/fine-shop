"use client";

import { useEffect } from "react";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

import { type z } from "zod";

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
import { Form, FormSubmit } from "@/core/components/custom/SmartForm";
import { ROUTES } from "@/core/constants/misc";
import { ProductFields } from "@/core/features/admin/products/ProductFields";
import { useCategoriesInfiniteSelect } from "@/core/services/client/categories";
import {
  useCreateProduct,
  useEditProduct,
  useProduct,
} from "@/core/services/client/products";
import { useBreadCrumbSelector } from "@/core/states/breadcrumb";
import { useProductAttributeSelector } from "@/core/states/productAttribute";
import { toFormData } from "@/core/utils/helpers";
import { productSchema } from "@/core/validation-shema";

const ModalAttribute = dynamic(
  () => import("@/core/features/admin/products/ModalAttribute"),
  {
    ssr: false,
  },
);
type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductPage() {
  const router = useRouter();
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
  const productData = getProduct.data?.data;

  async function handleSubmit(values: ProductFormValues) {
    const formData = toFormData(
      { ...values, attributeList: attributes } as ProductFormValues,
      {
        fileKeys: ["images"],
        jsonKeys: ["attributeList"],
      },
    );

    (editMode ? edit : create).mutate(formData, {
      onSuccess: () => {
        router.replace(ROUTES.PRODUCTS);
      },
    });
  }

  useEffect(
    () => setLabel("/admin/products/create-update", title),
    [setLabel, title],
  );

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
            <FormSubmit loading={create.isPending || edit.isPending}>
              ذخیره محصول
            </FormSubmit>
          </PageFooter>
        </Form>
      </PageContent>
    </Page>
  );
}
