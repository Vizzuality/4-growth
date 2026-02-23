import { FC } from "react";

import { Button } from "@/components/ui/button";

const FeedbackButton: FC = () => {
  return (
    <Button className="w-full" asChild>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSdmPZl2WSBP4NYwdtfMA9H97LRR7wctc_5ceASHrtgojcfjLQ/viewform"
        target="_blank"
        rel="noopener noreferrer"
      >
        Feedback
      </a>
    </Button>
  );
};

export default FeedbackButton;
