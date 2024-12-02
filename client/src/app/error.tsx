"use client";

import NoData from "@/containers/no-data";

import CloudOff from "@/components/icons/cloud-off";

export default function ErrorPage() {
  return (
    <div className="h-full min-h-screen">
      <NoData
        className="h-full"
        icon={<CloudOff />}
        description="Something went wrong, please check back soon."
      />
    </div>
  );
}
