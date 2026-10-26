"use client";

import { usePathname } from "next/navigation";
import { LandingHeader } from "@/components/LandingHeader";
import { ApplicationFoundHeader } from "./ApplicationFoundHeader";

export function ConditionalHeader() {
  const pathname = usePathname();

  // Show StatusCheckerHeader only on landing page
  if (pathname === "/") {
    return <LandingHeader />;
  }

  return <ApplicationFoundHeader />;
}
