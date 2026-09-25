"use client";

import { useState } from "react";

import { ModalDialog } from "@/core/components/custom/Modal";
import { notify } from "@/core/components/custom/notify";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { useProductAttributeSelector } from "@/core/states/productAttribute";

function ModalAttribute() {
  const [value, setValue] = useState("");
  const atts = useProductAttributeSelector.useAtts();
  const removeAtt = useProductAttributeSelector.useRemoveAtt();
  const addAtt = useProductAttributeSelector.useAddAtt();

  return (
    <ModalDialog
      size="2xl"
      trigger={<Button variant="secondary">ویژگی های محصول</Button>}
      title="ویژگی های کالا"
    >
      <ScrollArea className="h-64 w-full py-4 lg:h-96">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام ویژگی</TableHead>
              <TableHead>مقدار ویژگی</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {atts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-muted-foreground h-20 text-center"
                >
                  هیچ ویژگی‌ای اضافه نشده است.
                </TableCell>
              </TableRow>
            ) : (
              atts.map((att) => (
                <TableRow key={att.key}>
                  <TableCell>{att.key}</TableCell>
                  <TableCell>{att.value}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAtt(att.key)}
                    >
                      حذف
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
            <TableRow>
              <TableCell>{"c"}</TableCell>
              <TableCell>
                <Input
                  onChange={(e) => setValue(e.target.value)}
                  value={value}
                />
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const r = addAtt({ key: "c", value: "x" });
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
