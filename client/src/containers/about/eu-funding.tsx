import { FC } from "react";

import Image from "next/image";

const EUFunding: FC = () => {
  return (
    <section
      aria-label="European Union funding"
      className="flex flex-col items-start gap-8 rounded-2xl bg-[#10b24b] p-8 md:flex-row md:items-center"
    >
      <Image
        src="/images/about/fundedbytheEU.webp"
        alt="Funded by the European Union"
        width={4125}
        height={919}
        sizes="209px"
        className="h-auto w-[209px] shrink-0"
      />
      <p className="text-base leading-6 text-foreground">
        This project has received funding from the European Union&apos;s Horizon
        Europe research and innovation programme under grant agreement No.
        101134855.
      </p>
    </section>
  );
};

export default EUFunding;
