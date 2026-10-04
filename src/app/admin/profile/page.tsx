"use client";

import { PageFooter } from "@/core/components/custom/layout/Page";
import {
  Page,
  PageActions,
  PageContent,
  PageHeader,
  PageHeading,
  PageTitle,
  PageDescription,
} from "@/core/components/custom/layout/Page";
import { Form, FormSubmit } from "@/core/components/custom/SmartForm";
import { Badge } from "@/core/components/ui/badge";
import { ProfileFields } from "@/core/features/admin/profile/ProfileFields";
import { updateProfile } from "@/core/services/server/profile";
import { useAuthSelector } from "@/core/states/auth";
import { formatPhone, toFormData } from "@/core/utils/helpers";
import { userSchema, type UserTypeSchema } from "@/core/validation-shema";

export default function ProfilePage() {
  const defaultValues = useAuthSelector.useUserInfo();
  const token = useAuthSelector.useToken();
  const userInfoIsHydrated = useAuthSelector.useUserInfoIsHydrated();

  async function handleSubmit(values: UserTypeSchema) {
    const formData = toFormData(values, { fileKeys: ["avatar"] });
    await updateProfile({ token, data: formData });
  }

  return (
    <Page isLoading={!userInfoIsHydrated}>
      <PageHeader forwardBack>
        <PageHeading>
          <PageTitle>پروفایل من</PageTitle>
          <PageDescription>
            نام، نام خانوادگی، شماره تماس و تصویر پروفایل خود را ویرایش کنید.
          </PageDescription>
        </PageHeading>
        <PageActions>
          <Badge variant="secondary">مدیر</Badge>
        </PageActions>
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
