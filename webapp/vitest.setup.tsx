import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

beforeEach(() => {
  vi.mock("next/script", () => ({
    default: (props: Record<string, unknown>) => <script {...props} />,
  }));
  vi.stubGlobal("gtag", vi.fn());
});
