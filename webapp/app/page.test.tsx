import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LandingPage from "./page";
import { FormCode, type StatusRecord } from "@/components/types";
import { TaxReliefDataProvider, YearRecord } from "@/components/TaxReliefDataProvider";
import { logGAEvent } from "./utils/analytics";
import { determineRoute } from "./utils/determineRoute";
import { formatDate } from "./utils/formatDate";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/",
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
  const ssnInput = screen.getByRole("textbox", {
    name: /Social Security or Individual Taxpayer Identification Number */i,
  });
  const zipInput = screen.getByRole("textbox", {
    name: /ZIP code you submitted with your application */i,
  });
  const submitButton = screen.getByRole("button", { name: /Check Status/i });

  await user.type(ssnInput, "123456789");
  await user.type(zipInput, "07001");
  await user.click(submitButton);
};
export function buildStatusFixture(overrides: Partial<StatusRecord> = {}) {
  const record: StatusRecord = {
    return_year: "2025",
    application_date: "2026-03-19T00:00:00.000Z",
    form_code: FormCode.PAS1,
    anchor: [],
    ptr: [],
    stay_nj: [],
    ...overrides,
  };

  const yearRecord: YearRecord = {
    applicationDateString: formatDate(record.application_date),
    form_code: record.form_code,
    anchor: record.anchor,
    ptr: record.ptr,
    stay_nj: record.stay_nj,
    issueFlagged: undefined,
  };

  return { record, yearRecord };
}

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
    const { record, yearRecord } = buildStatusFixture();

    globalThis.fetch = mockFetchResponse({ records: [record] });

    renderLandingPage();
    await fillAndSubmitForm();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/status",
      expect.objectContaining({ method: "POST" }),
    );

    expect(determineRoute).toHaveBeenCalledWith(yearRecord);
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
    const { record } = buildStatusFixture({ return_year: "2024" });
    const statusResponseNoRecord = { records: [record] };

    it("it calls missed mailer API, when missed mailer record is found, sets datastore and routes user to missed-mailer", async () => {
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
          json: () => Promise.resolve({ missedMailer: true }),
        }) as unknown as typeof fetch;

      renderLandingPage();
      await fillAndSubmitForm();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/missed-mailer",
        expect.objectContaining({ method: "POST" }),
      );
      expect(mockPush).toHaveBeenCalledWith("/missed-mailer");
      expect(logGAEvent).toHaveBeenCalledWith(`missed_mailer_record_found`);
    });

    it("it calls missed mailer API, when missed mailer record is NOT found, it shows the application not found alert", async () => {
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
          json: () => Promise.resolve({ missedMailer: false }),
        }) as unknown as typeof fetch;

      renderLandingPage();
      await fillAndSubmitForm();

      expect(
        screen.getByRole("heading", { name: "No 2025 application found" }),
      ).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
      expect(logGAEvent).toHaveBeenCalledWith("api_200_record_not_found");
    });

    it("it calls missed mailer API, when response is not 200, it shows the error message", async () => {
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
      expect(logGAEvent).toHaveBeenCalledWith("missed_mailer_api_error");
    });
  });
});
