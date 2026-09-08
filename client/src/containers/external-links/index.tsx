import { FC } from "react";

import { ChevronRightIcon } from "lucide-react";

import { EXTERNAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface ExternalLinksProps {
  variant: "sidebar" | "bottom-bar";
}

/**
 * The bottom-bar variant is unwrapped so BottomBar can lay the links out in the
 * same flex row as its triggers and have every button come out the same width.
 */
const ExternalLinks: FC<ExternalLinksProps> = ({ variant }) => {
  const isSidebar = variant === "sidebar";
  const links = EXTERNAL_LINKS.map(({ label, href }) => (
    <Button
      key={href}
      variant={isSidebar ? "clean" : "default"}
      className={cn(
        "w-full",
        isSidebar &&
          "h-11 justify-between rounded-2xl bg-primary px-3 hover:bg-secondary",
      )}
      asChild
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <span>{label}</span>
        {isSidebar && (
          <span className="rounded-full bg-secondary p-2 group-hover:bg-magenta-500">
            <ChevronRightIcon className="h-4 w-4 text-white" />
          </span>
        )}
      </a>
    </Button>
  ));

  if (!isSidebar) return <>{links}</>;

  return <div className="-mt-0.5 flex w-full gap-0.5">{links}</div>;
};

export default ExternalLinks;
