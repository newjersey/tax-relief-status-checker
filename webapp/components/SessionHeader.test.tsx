import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import { SessionHeader } from "./SessionHeader";
import userEvent from "@testing-library/user-event";

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
});
