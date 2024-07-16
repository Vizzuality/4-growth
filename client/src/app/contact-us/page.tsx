import type { Metadata } from "next";

import ContactUsForm from "@/containers/contact-us";
import Header from "@/containers/header";

import Video from "@/components/ui/video";

export const metadata: Metadata = {
  title: "Contact us | 4Growth",
  description: "Contact us | 4Growth",
};

export default function ContactUsPage() {
  return (
    <>
      <Video
        src="/videos/wheat.mp4"
        className="fixed bottom-0 right-0 -z-10 h-full min-w-full object-cover"
        autoPlay
        loop
        muted
      />
      <div className="flex min-h-full items-center justify-center py-8">
        <div className="flex flex-col gap-0.5">
          <Header />
          <ContactUsForm />
        </div>
      </div>
    </>
  );
}
