import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LandingPage from "./page";
import type { StatusRecord } from "@/components/types";
import { TaxReliefDataProvider } from "@/components/TaxReliefDataProvider";
import { PaymentMethod } from "@/components/types";
import { logGAEvent } from "./utils/analytics";
import { determineRoute } from "./utils/determineRoute";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("./utils/analytics", () => ({
  logGAEvent: vi.fn(),
}));

vi.mock("./utils/determineRoute", () => ({
  determineRoute: vi.fn(),
}));

const renderLandingPage = () =>
  render(
    <TaxReliefDataProvider>
      <LandingPage />
    </TaxReliefDataProvider>,
  );

const fillAndSubmitForm = async () => {
  const user = userEvent.setup();
  const ssnInput = screen.getByLabelText(/Social Security/i);
  const zipInput = screen.getByLabelText(/ZIP code/i);
  const submitButton = screen.getByRole("button", { name: /Check Status/i });

  await user.type(ssnInput, "123456789");
  await user.type(zipInput, "07001");
  await user.click(submitButton);
};

const buildStatusRecord = (overrides?: Partial<StatusRecord>): StatusRecord => ({
  return_year: "2025",
  application_date: "2026-03-19T00:00:00.000Z",
  anchor: [],
  ptr: [],
  stay_nj: [],
  ...overrides,
});

const mockFetchResponse = (body: unknown, ok = true, status = 200) =>
  vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  }) as unknown as typeof fetch;

beforeEach(() => {
  vi.restoreAllMocks();
  mockPush.mockReset();
});

describe("onSubmit handler", () => {
  it("calls status API, if record found, sets data store and calls determineRoute", async () => {
    const record = buildStatusRecord();
    globalThis.fetch = mockFetchResponse({ records: [record] });

    renderLandingPage();
    await fillAndSubmitForm();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/status",
      expect.objectContaining({ method: "POST" }),
    );
    expect(determineRoute).toHaveBeenCalledWith(record);
    expect(logGAEvent).toHaveBeenCalledWith("api_200_record_found");
  });

  it("calls status API, when response is not 200, it shows the error message", async () => {
    globalThis.fetch = mockFetchResponse({}, false, 500);

    renderLandingPage();
    await fillAndSubmitForm();

    expect(
      screen.getByText(/We are having an issue checking on your application status/i),
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
    expect(logGAEvent).toHaveBeenCalledWith("api_error");
  });

  describe("when status API record not found", () => {
    const statusResponseNoRecord = { records: [buildStatusRecord({ return_year: "2024" })] };

    it("it calls autofile API, when autofile record is found, sets datastore and routes user to autofile", async () => {
      globalThis.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(statusResponseNoRecord),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({ autofilePlanned: true, paymentMethod: PaymentMethod.DIRECT_DEPOSIT }),
        }) as unknown as typeof fetch;

      renderLandingPage();
      await fillAndSubmitForm();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/autofile",
        expect.objectContaining({ method: "POST" }),
      );
      expect(mockPush).toHaveBeenCalledWith("/anchor-autofile");
      expect(logGAEvent).toHaveBeenCalledWith(`autofile_${PaymentMethod.DIRECT_DEPOSIT}`);
    });

    it("it calls autofile API, when autofile record is NOT found, it shows the application not found alert", async () => {
      globalThis.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(statusResponseNoRecord),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ autofilePlanned: false }),
        }) as unknown as typeof fetch;

      renderLandingPage();
      await fillAndSubmitForm();

      expect(
        screen.getByRole("heading", { name: "No 2025 application found" }),
      ).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
      expect(logGAEvent).toHaveBeenCalledWith("api_200_record_not_found");
    });

    it("it calls autofile API, when response is not 200, it shows the error message", async () => {
      globalThis.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(statusResponseNoRecord),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: () => Promise.resolve({}),
        }) as unknown as typeof fetch;

      renderLandingPage();
      await fillAndSubmitForm();

      expect(
        screen.getByText(/We are having an issue checking on your application status/i),
      ).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
      expect(logGAEvent).toHaveBeenCalledWith("autofile_api_error");
    });
  });
});
