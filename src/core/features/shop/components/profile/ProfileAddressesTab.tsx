"use client";

import * as React from "react";

import {
  Building2,
  CheckCircle2,
  Edit2,
  Home,
  MapPin,
  Phone,
  Plus,
  Trash2,
  User as UserIcon,
} from "lucide-react";

import { AlertModal } from "@/core/components/custom/AlertModal";
import { notify } from "@/core/components/custom/notify";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Checkbox } from "@/core/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { Textarea } from "@/core/components/ui/textarea";
import { cn } from "@/core/utils/helpers";

/**
 * Address entity interface representing buyer delivery locations.
 */
export interface UserAddress {
  id: string;
  title: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  addressDetail: string;
  isDefault: boolean;
}

/**
 * Form values for creating or editing an address.
 */
interface AddressFormValues {
  title: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  addressDetail: string;
  isDefault: boolean;
}

/**
 * Validation errors mapped to field names.
 */
type FormErrors = Partial<Record<keyof AddressFormValues, string>>;

/**
 * Initial sample addresses tailored for Iranian users.
 */
const INITIAL_ADDRESSES: UserAddress[] = [
  {
    id: "addr-1",
    title: "منزل",
    recipientName: "سارا احمدی",
    phone: "09123456789",
    province: "تهران",
    city: "تهران",
    postalCode: "1939543211",
    addressDetail:
      "خیابان ولیعصر، بالاتر از پارک ساعی، کوچه ساعی یکم، پلاک ۱۲، طبقه ۳، واحد ۶",
    isDefault: true,
  },
  {
    id: "addr-2",
    title: "محل کار",
    recipientName: "سارا احمدی",
    phone: "09198765432",
    province: "تهران",
    city: "تهران",
    postalCode: "1417614411",
    addressDetail:
      "میدان انقلاب، خیابان کارگر شمالی، خیابان فرصت شیرازی، ساختمان پیام، پلاک ۵، طبقه ۴",
    isDefault: false,
  },
];

const DEFAULT_FORM_VALUES: AddressFormValues = {
  title: "",
  recipientName: "",
  phone: "",
  province: "",
  city: "",
  postalCode: "",
  addressDetail: "",
  isDefault: false,
};

/**
 * ProfileAddressesTab component manages buyer delivery addresses.
 */
export function ProfileAddressesTab() {
  const [addresses, setAddresses] =
    React.useState<UserAddress[]>(INITIAL_ADDRESSES);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingAddressId, setEditingAddressId] = React.useState<string | null>(
    null,
  );
  const [deletingAddressId, setDeletingAddressId] = React.useState<
    string | null
  >(null);

  const [formValues, setFormValues] =
    React.useState<AddressFormValues>(DEFAULT_FORM_VALUES);
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});

  // Reset form state when dialog closes or opens for creation
  const handleOpenCreateDialog = () => {
    setEditingAddressId(null);
    setFormValues({
      ...DEFAULT_FORM_VALUES,
      // If there are no existing addresses, the new one should automatically be default
      isDefault: addresses.length === 0,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  // Populate form with existing address details for editing
  const handleOpenEditDialog = (address: UserAddress) => {
    setEditingAddressId(address.id);
    setFormValues({
      title: address.title,
      recipientName: address.recipientName,
      phone: address.phone,
      province: address.province,
      city: address.city,
      postalCode: address.postalCode,
      addressDetail: address.addressDetail,
      isDefault: address.isDefault,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  // Validate form inputs prior to saving
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formValues.title.trim()) {
      errors.title = "لطفاً عنوان آدرس را وارد کنید";
    }

    if (!formValues.recipientName.trim()) {
      errors.recipientName = "نام تحویل‌گیرنده الزامی است";
    }

    const cleanPhone = formValues.phone.trim();
    if (!cleanPhone) {
      errors.phone = "شماره تماس الزامی است";
    } else if (!/^09\d{9}$/.test(cleanPhone)) {
      errors.phone = "شماره تماس معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)";
    }

    if (!formValues.province.trim()) {
      errors.province = "استان الزامی است";
    }

    if (!formValues.city.trim()) {
      errors.city = "شهر الزامی است";
    }

    const cleanPostal = formValues.postalCode.trim();
    if (!cleanPostal) {
      errors.postalCode = "کد پستی الزامی است";
    } else if (!/^\d{10}$/.test(cleanPostal)) {
      errors.postalCode = "کد پستی باید ۱۰ رقم باشد";
    }

    if (!formValues.addressDetail.trim() || formValues.addressDetail.trim().length < 5) {
      errors.addressDetail = "نشانی دقیق پستی را به طور کامل وارد کنید";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle saving new or updated address
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const trimmedValues: AddressFormValues = {
      title: formValues.title.trim(),
      recipientName: formValues.recipientName.trim(),
      phone: formValues.phone.trim(),
      province: formValues.province.trim(),
      city: formValues.city.trim(),
      postalCode: formValues.postalCode.trim(),
      addressDetail: formValues.addressDetail.trim(),
      isDefault: formValues.isDefault,
    };

    if (editingAddressId) {
      // Editing existing address
      setAddresses((prev) =>
        prev.map((addr) => {
          if (addr.id === editingAddressId) {
            return {
              ...addr,
              ...trimmedValues,
            };
          }
          // If edited address is marked default, unset default on other addresses
          if (trimmedValues.isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        }),
      );
      notify.success("آدرس با موفقیت ویرایش شد");
    } else {
      // Adding new address
      const newAddress: UserAddress = {
        id: `addr-${Date.now()}`,
        ...trimmedValues,
        // Make default if it's the first address or explicitly marked default
        isDefault: addresses.length === 0 ? true : trimmedValues.isDefault,
      };

      setAddresses((prev) => {
        if (newAddress.isDefault) {
          return [...prev.map((a) => ({ ...a, isDefault: false })), newAddress];
        }
        return [...prev, newAddress];
      });

      notify.success("آدرس جدید با موفقیت اضافه شد");
    }

    setDialogOpen(false);
  };

  // Set address as primary/default
  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );
    notify.success("آدرس پیش‌فرض با موفقیت به‌روزرسانی شد");
  };

  // Remove address from list
  const handleDeleteAddress = () => {
    if (!deletingAddressId) return;

    setAddresses((prev) => {
      const remaining = prev.filter((addr) => addr.id !== deletingAddressId);
      const wasDefault = prev.find((a) => a.id === deletingAddressId)?.isDefault;

      // If removed address was default and there are remaining items, promote first item
      if (wasDefault && remaining.length > 0) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      return remaining;
    });

    setDeletingAddressId(null);
    notify.success("آدرس با موفقیت حذف شد");
  };

  return (
    <div className="space-y-6">
      {/* Header section with title and add action button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-foreground text-lg font-bold sm:text-xl">
            آدرس‌های من
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            مدیریت و ثبت نشانی‌های ارسال سفارش‌ها
          </p>
        </div>

        <Button
          onClick={handleOpenCreateDialog}
          className="gap-2 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>افزودن آدرس جدید</span>
        </Button>
      </div>

      {/* Empty State */}
      {addresses.length === 0 ? (
        <Card className="border-border bg-card/50 flex flex-col items-center justify-center py-12 text-center shadow-none">
          <div className="bg-primary/10 text-primary mb-4 flex size-16 items-center justify-center rounded-full">
            <MapPin className="size-8" />
          </div>
          <h3 className="text-foreground text-base font-semibold">
            هنوز آدرسی ثبت نکرده‌اید
          </h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-xs sm:text-sm">
            برای ثبت سریع‌تر و آسان‌تر سفارش‌ها، می‌توانید نشانی‌های تحویل خود را در این بخش اضافه کنید.
          </p>
          <Button
            onClick={handleOpenCreateDialog}
            className="mt-6 gap-2"
          >
            <Plus className="size-4" />
            <span>ثبت اولین آدرس</span>
          </Button>
        </Card>
      ) : (
        /* Address Cards Grid */
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={cn(
                "relative flex flex-col justify-between transition-all duration-200",
                address.isDefault
                  ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                  : "border-border hover:border-border/80 bg-card",
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        address.isDefault
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {address.title === "منزل" ? (
                        <Home className="size-4" />
                      ) : (
                        <Building2 className="size-4" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-foreground text-sm font-semibold sm:text-base">
                        {address.title}
                      </CardTitle>
                      <p className="text-muted-foreground text-xs">
                        {address.province}، {address.city}
                      </p>
                    </div>
                  </div>

                  {address.isDefault && (
                    <Badge
                      variant="default"
                      className="bg-primary/90 gap-1 text-[11px] font-normal"
                    >
                      <CheckCircle2 className="size-3" />
                      <span>پیش‌فرض</span>
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pb-3 text-xs sm:text-sm">
                {/* Full street address details */}
                <p className="text-foreground leading-relaxed">
                  {address.addressDetail}
                </p>

                {/* Recipient meta details */}
                <div className="border-border/60 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-2.5 text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <UserIcon className="size-3.5 shrink-0" />
                    <span>تحویل‌گیرنده:</span>
                    <strong className="text-foreground font-medium">
                      {address.recipientName}
                    </strong>
                  </span>

                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Phone className="size-3.5 shrink-0" />
                    <span dir="ltr">{address.phone}</span>
                  </span>

                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <span>کد پستی:</span>
                    <span dir="ltr" className="tracking-wider">
                      {address.postalCode}
                    </span>
                  </span>
                </div>
              </CardContent>

              <CardFooter className="border-border/60 flex items-center justify-between border-t pt-3">
                {/* Default address toggle action */}
                <div>
                  {!address.isDefault ? (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleSetDefault(address.id)}
                      className="text-muted-foreground hover:text-foreground text-xs"
                    >
                      انتخاب به عنوان پیش‌فرض
                    </Button>
                  ) : (
                    <span className="text-primary flex items-center gap-1 text-xs font-medium">
                      <CheckCircle2 className="size-3.5" />
                      <span>آدرس پیش‌فرض سفارش‌ها</span>
                    </span>
                  )}
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleOpenEditDialog(address)}
                    className="text-muted-foreground hover:text-foreground"
                    title="ویرایش آدرس"
                  >
                    <Edit2 className="size-3.5" />
                    <span className="sr-only">ویرایش</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeletingAddressId(address.id)}
                    className="text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                    title="حذف آدرس"
                  >
                    <Trash2 className="size-3.5" />
                    <span className="sr-only">حذف</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <AlertModal
        open={Boolean(deletingAddressId)}
        onOpenChange={(open) => !open && setDeletingAddressId(null)}
        title="حذف آدرس"
        description="آیا از حذف این آدرس اطمینان دارید؟ این عملیات قابل بازگشت نخواهد بود."
        confirmText="حذف آدرس"
        cancelText="انصراف"
        confirmVariant="destructive"
        onConfirm={handleDeleteAddress}
      />

      {/* Add / Edit Address Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAddressId ? "ویرایش آدرس" : "افزودن آدرس جدید"}
            </DialogTitle>
            <DialogDescription>
              اطلاعات نشانی تحویل سفارش را با دقت وارد فرمایید.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAddress} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Address label / title */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address-title">
                  عنوان آدرس <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="address-title"
                  placeholder="مانند: منزل، محل کار، ویلا..."
                  value={formValues.title}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
                {formErrors.title && (
                  <p className="text-destructive text-xs">{formErrors.title}</p>
                )}
              </div>

              {/* Recipient full name */}
              <div className="space-y-1.5">
                <Label htmlFor="recipient-name">
                  نام و نام خانوادگی تحویل‌گیرنده{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="recipient-name"
                  placeholder="مثال: علی محمدی"
                  value={formValues.recipientName}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      recipientName: e.target.value,
                    }))
                  }
                />
                {formErrors.recipientName && (
                  <p className="text-destructive text-xs">
                    {formErrors.recipientName}
                  </p>
                )}
              </div>

              {/* Recipient phone */}
              <div className="space-y-1.5">
                <Label htmlFor="recipient-phone">
                  شماره تماس تحویل‌گیرنده{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="recipient-phone"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  dir="ltr"
                  type="tel"
                  className="text-right"
                  value={formValues.phone}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
                {formErrors.phone && (
                  <p className="text-destructive text-xs">{formErrors.phone}</p>
                )}
              </div>

              {/* Province */}
              <div className="space-y-1.5">
                <Label htmlFor="province">
                  استان <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="province"
                  placeholder="مثال: تهران"
                  value={formValues.province}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      province: e.target.value,
                    }))
                  }
                />
                {formErrors.province && (
                  <p className="text-destructive text-xs">
                    {formErrors.province}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <Label htmlFor="city">
                  شهر <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="مثال: تهران"
                  value={formValues.city}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                />
                {formErrors.city && (
                  <p className="text-destructive text-xs">{formErrors.city}</p>
                )}
              </div>

              {/* Postal Code */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="postal-code">
                  کد پستی (۱۰ رقم){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="postal-code"
                  placeholder="۱۰ رقم بدون خط تیره"
                  dir="ltr"
                  maxLength={10}
                  className="text-right tracking-widest"
                  value={formValues.postalCode}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      postalCode: e.target.value,
                    }))
                  }
                />
                {formErrors.postalCode && (
                  <p className="text-destructive text-xs">
                    {formErrors.postalCode}
                  </p>
                )}
              </div>

              {/* Detailed Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address-detail">
                  نشانی دقیق پستی <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="address-detail"
                  rows={3}
                  placeholder="خیابان اصلی، کوچه، پلاک، واحد..."
                  value={formValues.addressDetail}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      addressDetail: e.target.value,
                    }))
                  }
                />
                {formErrors.addressDetail && (
                  <p className="text-destructive text-xs">
                    {formErrors.addressDetail}
                  </p>
                )}
              </div>

              {/* Default Address Checkbox */}
              <div className="flex items-center gap-2 sm:col-span-2 pt-1">
                <Checkbox
                  id="is-default"
                  checked={formValues.isDefault}
                  onCheckedChange={(checked) =>
                    setFormValues((prev) => ({
                      ...prev,
                      isDefault: Boolean(checked),
                    }))
                  }
                />
                <Label
                  htmlFor="is-default"
                  className="cursor-pointer text-xs font-normal sm:text-sm"
                >
                  این آدرس به عنوان آدرس پیش‌فرض تحویل سفارش تنظیم شود.
                </Label>
              </div>
            </div>

            <DialogFooter className="mt-6 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                انصراف
              </Button>
              <Button type="submit">
                {editingAddressId ? "ذخیره تغییرات" : "افزودن آدرس"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfileAddressesTab;
