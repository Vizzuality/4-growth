import { FC } from "react";

import { ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const FeedbackButton: FC = () => {
  return (
    <Button
      variant="clean"
      className="-mt-0.5 h-16 w-full justify-between rounded-2xl bg-primary hover:bg-secondary"
      asChild
    >
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSdmPZl2WSBP4NYwdtfMA9H97LRR7wctc_5ceASHrtgojcfjLQ/viewform"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Feedback</span>
        <span className="rounded-full bg-magenta-500 p-2">
          <ChevronRightIcon className="h-4 w-4 text-white" />
        </span>
      </a>
    </Button>
  );
};

export default FeedbackButton;
