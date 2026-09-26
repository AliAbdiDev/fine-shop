"use client";

import { useEffect, useRef, useState } from "react";

import { ModalDialog } from "@/core/components/custom/Modal";
import { notify } from "@/core/components/custom/notify";
import { SelectField } from "@/core/components/custom/SelectField";
import { Button } from "@/core/components/ui/button";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { useAttributes } from "@/core/services/client/products";
import { useProductAttributeSelector } from "@/core/states/productAttribute";
import { type ProductAttributes } from "@/core/types/entities.types";

function ModalAttribute({
  initAttributes,
}: {
  initAttributes?: ProductAttributes;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [key, setKey] = useState<string | null>(null);

  const getAllAtts = useAttributes({ enabled: open });

  const init = useProductAttributeSelector.useInit();

  const attsData = getAllAtts.data?.data || [];
  const findValuesByKey =
    attsData.find((item) => item.key === key)?.values || [];

  const isHydrat = useRef(false);

  useEffect(() => {
    if (isHydrat.current) return;
    if (initAttributes) {
      init(initAttributes);
      isHydrat.current = true;
    }
  }, [initAttributes, init]);

  const atts = useProductAttributeSelector.useAtts();
  const removeAtt = useProductAttributeSelector.useRemoveAtt();
  const addAtt = useProductAttributeSelector.useAddAtt();

  return (
    <ModalDialog
      onClose={() => {
        setValue(null);
        setKey(null);
      }}
      size="xl"
      trigger={<Button variant="secondary">ویژگی های محصول</Button>}
      description={
        <>
          {" "}
          پس از افزودن ویژگی ها برای ذخیره سازی آنها از پنجره خارج شوید و دکمه{" "}
          <span className="font-vazir-bold text-nowrap">ذخیره محصول</span> را
          کلیک کنید تا تغییرات شما ذخیره شود.
        </>
      }
      title="ویژگی های کالا"
      open={open}
      onOpenChange={setOpen}
    >
      <ScrollArea className="h-64 w-full py-4 lg:h-[60vh]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام ویژگی</TableHead>
              <TableHead>مقدار ویژگی</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {atts.map((att) => (
              <TableRow key={att.key}>
                <TableCell>{att.key}</TableCell>
                <TableCell>{att.values[0]}</TableCell>
                <TableCell className="w-20">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeAtt(att.key)}
                  >
                    حذف
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell>
                <SelectField
                  key={`key-select-${attsData.length}`}
                  onValueChange={(v: string) => {
                    setKey(v);
                    setValue(null);
                  }}
                  value={key ?? undefined}
                  options={attsData.map((att) => ({
                    value: att.key,
                    label: att.key,
                  }))}
                  isLoading={getAllAtts.isPending}
                />
              </TableCell>
              <TableCell>
                <SelectField
                  key={`value-select-${key ?? "empty"}`}
                  options={findValuesByKey.map((foundAtt) => ({
                    value: foundAtt,
                    label: foundAtt,
                  }))}
                  onValueChange={(v: string) => setValue(v)}
                  isLoading={getAllAtts.isPending}
                  value={value ?? undefined}
                />
              </TableCell>
              <TableCell className="w-20">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const r = addAtt({ key, values: value ? [value] : null });
                    if (r) notify.warning(r.message);
                  }}
                >
                  افزودن
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ScrollArea>
    </ModalDialog>
  );
}

export default ModalAttribute;
