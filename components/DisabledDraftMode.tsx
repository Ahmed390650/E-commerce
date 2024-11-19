"use client";
import React from "react";
import { useDraftModeEnvironment } from "next-sanity/hooks";
import { useRouter } from "next/navigation";
const DisabledDraftMode = () => {
  const env = useDraftModeEnvironment();
  const router = useRouter();
  if (env !== "live" && env !== "unknown") return null;

  const handleClick = async () => {
    await fetch("/draft-mode/disable");
    router.refresh();
  };
  return (
    <button
      onClick={handleClick}
      className="fixed right-3 bottom-4 bg-gray-50 px-4 py-2 z-50">
      Disable Draft mode
    </button>
  );
};

export default DisabledDraftMode;
