import { ModalDialog } from "@/core/components/custom/Modal";
import { Button } from "@/core/components/ui/button";

function ModalAttribute() {
  return <ModalDialog trigger={<Button>click me</Button>}>c</ModalDialog>;
}

export default ModalAttribute;
