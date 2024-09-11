import { FC, PropsWithChildren, useState } from "react";

import { Accordion } from "@/components/ui/accordion";

interface SidebarAccordionProps {
  defaultValue?: string[];
}

const SidebarAccordion: FC<PropsWithChildren<SidebarAccordionProps>> = ({
  defaultValue,
  children,
}) => {
  const [value, setValue] = useState(defaultValue || undefined);

  return (
    <Accordion
      type="multiple"
      className="w-full"
      value={value}
      onValueChange={setValue}
    >
      {children}
    </Accordion>
  );
};

export default SidebarAccordion;
