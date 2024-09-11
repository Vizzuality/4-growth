import { FC, PropsWithChildren, useEffect, useState } from "react";

import { Accordion } from "@/components/ui/accordion";

interface SidebarAccordionProps {
  defaultValue?: string[];
}

const SidebarAccordion: FC<PropsWithChildren<SidebarAccordionProps>> = ({
  defaultValue,
  children,
}) => {
  const [value, setValue] = useState(defaultValue || undefined);

  useEffect(() => {
    if (value === defaultValue) return;
    setValue(defaultValue);
  }, [defaultValue, setValue]);

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
