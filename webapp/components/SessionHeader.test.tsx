import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import { CurrentYearLink, SessionHeader, YearSelector } from "./SessionHeader";
import userEvent from "@testing-library/user-event";
import { CurrentYear, DataType, YearRecord } from "./TaxReliefDataProvider";

const { mockSetCurrentYear, state } = vi.hoisted(() => ({
  mockSetCurrentYear: vi.fn(),
  state: { dataStore: null as any },
}));

vi.mock("@/components/TaxReliefDataProvider", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/components/TaxReliefDataProvider")>()),
  useDataStore: () => ({
    dataStore: state.dataStore,
    setDataStore: vi.fn(),
    setCurrentYear: mockSetCurrentYear,
    record: null,
  }),
}));

const buildStore = (currentYear: CurrentYear, years: CurrentYear[]) => ({
  type: DataType.STATUS,
  currentYear,
  lastFourSsnDigits: "1234",
  zipCode: "08608",
  records: Object.fromEntries(years.map((y) => [y, {}])),
});

beforeEach(() => {
  mockSetCurrentYear.mockClear();
  state.dataStore = buildStore(CurrentYear.YEAR2025, [CurrentYear.YEAR2025]);
});

describe("header component", () => {
  it("renders the header", async () => {
    render(<SessionHeader />);
    expect(document.body.textContent).toContain("Property Tax Relief");
    expect(document.body.textContent).toContain("Status Checker");
    expect(document.body.textContent).toContain("2025");
    expect(document.body.textContent).toContain("Log out");
  });

  it("opens and closes overlay when button clicked", async () => {
    const user = userEvent.setup();
    render(<SessionHeader />);

    const overlay = document.querySelector(".usa-overlay");
    expect(overlay).not.toHaveClass("is-visible");

    const menuButton = screen.getByRole("button", { name: /Menu/i });
    await user.click(menuButton);
    expect(overlay).toHaveClass("is-visible");

    const closeButton = screen.getByRole("button", { name: /Close/i });
    await user.click(closeButton);
    expect(overlay).not.toHaveClass("is-visible");
  });

  it("does not show navigator if there is only 2025 record found", async () => {
    state.dataStore = buildStore(CurrentYear.YEAR2025, [CurrentYear.YEAR2025]);
    render(<SessionHeader />);
    expect(screen.queryByText("Prior Tax Years")).not.toBeInTheDocument();
    expect(screen.queryByText("2024")).not.toBeInTheDocument();
  });

  it("does not show navigator if there is only 2024 record found", async () => {
    state.dataStore = buildStore(CurrentYear.YEAR2024, [CurrentYear.YEAR2024]);
    render(<SessionHeader />);
    expect(screen.queryByText("Prior Tax Years")).not.toBeInTheDocument();
    expect(screen.queryByText("2025")).not.toBeInTheDocument();
  });
});

describe("CurrentYearLink Component", () => {
  const setCurrentYear = vi.fn();

  beforeEach(() => {
    setCurrentYear.mockClear();
  });

  const renderCurrentYearLink = (
    currentYear: CurrentYear,
    records: Readonly<Partial<Record<CurrentYear, YearRecord>>>,
  ) =>
    render(
      <CurrentYearLink
        currentYear={currentYear}
        records={records}
        setCurrentYear={setCurrentYear}
      />,
    );

  it("shows 2025 as current when both records exist, 2025 is selected", () => {
    state.dataStore = buildStore(CurrentYear.YEAR2025, [
      CurrentYear.YEAR2025,
      CurrentYear.YEAR2024,
    ]);
    renderCurrentYearLink(CurrentYear.YEAR2025, state.dataStore.records);
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("2025").closest("a")).toHaveClass("usa-current");
  });
  it("shows 2025 as clickable when both records exist, 2024 is selected", () => {
    state.dataStore = buildStore(CurrentYear.YEAR2024, [
      CurrentYear.YEAR2025,
      CurrentYear.YEAR2024,
    ]);
    renderCurrentYearLink(CurrentYear.YEAR2024, state.dataStore.records);
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("2025").closest("a")).toHaveClass("usa-nav__link");
  });
  it("shows 2025 as current when only 2025 record exists", () => {
    state.dataStore = buildStore(CurrentYear.YEAR2025, [CurrentYear.YEAR2025]);
    renderCurrentYearLink(CurrentYear.YEAR2025, state.dataStore.records);
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("2025").closest("a")).toHaveClass("usa-current");
  });
  it("shows 2024 as current when only 2024 record exists", () => {
    state.dataStore = buildStore(CurrentYear.YEAR2024, [CurrentYear.YEAR2024]);
    renderCurrentYearLink(CurrentYear.YEAR2024, state.dataStore.records);
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("2024").closest("a")).toHaveClass("usa-current");
  });
});

describe("YearNavigator Component", () => {
  const setCurrentYear = vi.fn();

  beforeEach(() => {
    setCurrentYear.mockClear();
  });

  const renderYearSelector = (
    currentYear: CurrentYear,
    records: Readonly<Partial<Record<CurrentYear, YearRecord>>>,
  ) =>
    render(
      <YearSelector currentYear={currentYear} setCurrentYear={setCurrentYear} records={records} />,
    );

  it("shows prior tax years when both records exist, 2025 is selected", () => {
    state.dataStore = buildStore(CurrentYear.YEAR2025, [
      CurrentYear.YEAR2025,
      CurrentYear.YEAR2024,
    ]);
    renderYearSelector(CurrentYear.YEAR2025, state.dataStore.records);
    expect(screen.getByText("Prior Tax Years")).toBeInTheDocument();
  });
  it("shows 2024 as current when both records exist, 2024 is selected", () => {
    state.dataStore = buildStore(CurrentYear.YEAR2024, [
      CurrentYear.YEAR2025,
      CurrentYear.YEAR2024,
    ]);
    renderYearSelector(CurrentYear.YEAR2024, state.dataStore.records);
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("2024").closest("button")).toHaveClass("usa-current");
  });
});
