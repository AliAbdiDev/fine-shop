"use client";

import { useRef, useState } from "react";

import {
  Calendar,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";

import { notify } from "@/core/components/custom/notify";
import {
  Form,
  FormField,
  FormSubmit,
} from "@/core/components/custom/SmartForm";
import { Badge } from "@/core/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { removeAvatar, updateProfile } from "@/core/services/server/profile";
import { useAuthSelector } from "@/core/states/auth";
import { type User } from "@/core/types/entities.types";
import { formatPhone, toFormData } from "@/core/utils/helpers";
import { formatJalaliDate } from "@/core/utils/jalali";
import { userSchema, type UserTypeSchema } from "@/core/validation-shema";

// Re-export profile actions for feature modularity
export { removeAvatar, updateProfile };

/**
 * Profile information tab displaying user avatar, details, and personal info edit form.
 * Optimized with accessible labels, landmarks, and touch targets.
 */
export function ProfileInfoTab() {
  const userInfo = useAuthSelector.useUserInfo();
  const setUserInfo = useAuthSelector.useSetUserInfo();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Trigger file selection dialog when user clicks on avatar parent element
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle selected file change and generate instant preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        notify.error("حجم تصویر نباید بیشتر از ۵ مگابایت باشد");
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Handle form submission and update user auth store
  async function handleSubmit(values: UserTypeSchema) {
    // If a new avatar file was chosen, include it in the form data
    const submissionValues: UserTypeSchema = {
      ...values,
      avatar: selectedFile || (userInfo?.avatar as User["avatar"]) || null,
    };

    const formData = toFormData(submissionValues, { fileKeys: ["avatar"] });
    const res = await updateProfile({ data: formData });

    if (res?.ok) {
      if (res.data) setUserInfo(res.data);
      notify.success("اطلاعات پروفایل با موفقیت ذخیره شد");
    } else {
      notify.error(res?.error?.code);
    }
  }

  const registeredAt = userInfo?.createdAt
    ? formatJalaliDate(userInfo.createdAt)
    : null;

  // Determine current avatar image source (live preview, existing avatar URL, or fallback)
  const existingAvatarUrl =
    typeof userInfo?.avatar === "string"
      ? userInfo.avatar
      : (userInfo?.avatar as { url?: string })?.url;
  const currentAvatarSrc = previewUrl || existingAvatarUrl;

  return (
    <Card
      className="border-border bg-card shadow-sm"
      role="region"
      aria-label="اطلاعات حساب کاربری"
    >
      <CardHeader className="border-b pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Round Avatar Container with Click-to-Upload & Preview */}
            <div className="relative group shrink-0">
              <div
                onClick={handleAvatarClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleAvatarClick();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="تغییر تصویر پروفایل"
                className="relative size-16 sm:size-20 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-all shadow-sm bg-primary/10 flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {currentAvatarSrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={currentAvatarSrc}
                    alt="تصویر پروفایل کاربر"
                    className="size-full object-cover"
                  />
                ) : (
                  <UserIcon
                    className="size-8 sm:size-10 text-primary"
                    aria-hidden="true"
                  />
                )}
                {/* Subtle overlay on hover */}
                <div
                  className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  aria-hidden="true"
                />
              </div>

              {/* Small Pencil Icon at bottom-right */}
              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground size-6 sm:size-7 rounded-full flex items-center justify-center shadow-md border-2 border-background hover:scale-105 transition-transform cursor-pointer"
                aria-label="انتخاب و تغییر تصویر پروفایل"
                title="تغییر تصویر پروفایل"
              >
                <Pencil className="size-3 sm:size-3.5" aria-hidden="true" />
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileChange}
                aria-hidden="true"
              />
            </div>

            <div className="space-y-1">
              <CardTitle className="text-lg sm:text-xl">
                {userInfo?.firstName || userInfo?.lastName
                  ? `${userInfo?.firstName ?? ""} ${userInfo?.lastName ?? ""}`.trim()
                  : "حساب کاربری خریدار"}
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {userInfo?.email || "ایمیل ثبت نشده است"}
                </span>
              </CardDescription>
            </div>
          </div>

          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="وضعیت حساب کاربری"
          >
            <Badge variant="secondary" className="gap-1 font-normal text-xs">
              <ShieldCheck
                className="size-3 text-emerald-600"
                aria-hidden="true"
              />
              <span>حساب کاربری خریدار</span>
            </Badge>
            {registeredAt && (
              <Badge variant="outline" className="gap-1 font-normal text-xs">
                <Calendar className="size-3" aria-hidden="true" />
                <span>عضویت: {registeredAt}</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <Form
          schema={userSchema}
          onSubmit={handleSubmit}
          defaultValues={{
            firstName: userInfo?.firstName || "",
            lastName: userInfo?.lastName || "",
            phoneNumber: formatPhone(userInfo?.phoneNumber) || "",
            avatar: (userInfo?.avatar as User["avatar"]) ?? null,
          }}
        >
          <div className="space-y-6">
            {/* Personal Information Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <FormField name="firstName" label="نام">
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder="نام خود را وارد کنید"
                    autoComplete="given-name"
                    aria-label="نام کوچک"
                  />
                )}
              </FormField>

              <FormField name="lastName" label="نام خانوادگی">
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder="نام خانوادگی خود را وارد کنید"
                    autoComplete="family-name"
                    aria-label="نام خانوادگی"
                  />
                )}
              </FormField>

              <FormField
                name="phoneNumber"
                label="شماره تماس"
                normalize={formatPhone}
              >
                {({ field }) => (
                  <div className="relative">
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      type="tel"
                      dir="ltr"
                      className="pl-9 text-right"
                      autoComplete="tel"
                      aria-label="شماره تماس تلفن همراه"
                    />
                    <Phone
                      className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </FormField>
            </div>
          </div>

          <CardFooter className="mt-8 flex justify-end gap-3 border-t px-0 pt-6">
            <FormSubmit className="w-full sm:w-auto min-h-[44px]">
              ذخیره تغییرات
            </FormSubmit>
          </CardFooter>
        </Form>
      </CardContent>
    </Card>
  );
}
