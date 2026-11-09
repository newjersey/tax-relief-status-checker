import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import "../i18n/config";

beforeEach(() => {
  vi.mock("next/script", () => ({
    default: (props: Record<string, unknown>) => <script {...props} />,
  }));
  vi.stubGlobal("gtag", vi.fn());

  /*useDataStore now calls useRouter() and usePathname() from next/navigation,
  and those hooks throw invariant expected app router to be mounted outside a
  real Next.js App Router. In Vitest there's no router, so every test that renders
  a component calling useDataStore() crashes, whether or not it cares about routing*/
  vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
    usePathname: () => "/",
  }));
});
