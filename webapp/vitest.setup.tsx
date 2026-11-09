import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import "../i18n/config";

beforeEach(() => {
  vi.mock("next/script", () => ({
    default: (props: Record<string, unknown>) => <script {...props} />,
  }));
  vi.stubGlobal("gtag", vi.fn());

  vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
    usePathname: () => "/",
  }));
});
