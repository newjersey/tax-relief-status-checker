"use client";

import "../../i18n/config";

import type { ReactNode } from "react";

/** Client-side provider that initializes i18next for all descendant components. */
export const I18nProvider = ({ children }: { readonly children: ReactNode }) => <>{children}</>;
