"use client";

import { PageFooter } from "@/core/components/custom/layout/Page";
import {
  Page,
  PageContent,
  PageHeader,
  PageHeading,
  PageTitle,
  PageDescription,
} from "@/core/components/custom/layout/Page";
import { notify } from "@/core/components/custom/notify";
import { Form, FormSubmit } from "@/core/components/custom/SmartForm";
import { ProfileFields } from "@/core/features/admin/profile/ProfileFields";
import { updateProfile } from "@/core/services/server/profile";
import { useAuthSelector } from "@/core/states/auth";
import { formatPhone, toFormData } from "@/core/utils/helpers";
import { userSchema, type UserTypeSchema } from "@/core/validation-shema";

export default function ProfilePage() {
  const defaultValues = useAuthSelector.useUserInfo();
  const userInfoIsHydrated = useAuthSelector.useUserInfoIsHydrated();

  async function handleSubmit(values: UserTypeSchema) {
    const formData = toFormData(values, { fileKeys: ["avatar"] });
    const r = await updateProfile({ data: formData });
    if (r?.ok) notify.success();
    else notify.error(r?.error.code);
  }

  return (
    <Page isLoading={!userInfoIsHydrated}>
      <PageHeader forwardBack>
        <PageHeading>
          <PageTitle>پروفایل من</PageTitle>
          <PageDescription>
            نام، نام خانوادگی، شماره تماس و تصویر پروفایل خود را ویرایش کنید.{" "}
            <br />
            {defaultValues?.email}
          </PageDescription>
        </PageHeading>
      </PageHeader>

      <PageContent>
        <Form
          schema={userSchema}
          onSubmit={handleSubmit}
          defaultValues={{
            ...defaultValues,
            phoneNumber: formatPhone(defaultValues?.phoneNumber),
          }}
        >
          <ProfileFields />
          <PageFooter>
            <FormSubmit>ذخیره تغییرات</FormSubmit>
          </PageFooter>
        </Form>
      </PageContent>
    </Page>
  );
}
