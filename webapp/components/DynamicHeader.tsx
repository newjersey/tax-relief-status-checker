"use client";

import { usePathname } from "next/navigation";
import { LandingHeader } from "@/components/LandingHeader";
import { SessionHeader } from "./SessionHeader";

export function DynamicHeader() {
  const pathname = usePathname();

  // Show StatusCheckerHeader only on landing page
  if (pathname === "/") {
    return <LandingHeader />;
  }

  return <SessionHeader />;
}
