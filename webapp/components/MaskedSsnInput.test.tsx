import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { MaskedSsnInput } from "./MaskedSsnInput";

import type { MaskedSsnInputProps } from "./MaskedSsnInput";

/** Creates default props with overrides for test convenience. */
const buildProps = (overrides?: Partial<MaskedSsnInputProps>): MaskedSsnInputProps => ({
  value: "",
  onChange: vi.fn(),
  onBlur: vi.fn(),
  name: "ssn",
  id: "ssn",
  ...overrides,
});

/**
 * Renders the component in a controlled fashion so that onChange calls update the displayed value
 * on re-render — matching real form behavior.
 */
const renderControlled = (initialProps?: Partial<MaskedSsnInputProps>) => {
  const onChange = vi.fn();
  const onBlur = vi.fn();
  let currentValue = initialProps?.value ?? "";

  const props = buildProps({ ...initialProps, value: currentValue, onChange, onBlur });

  const { rerender } = render(<MaskedSsnInput {...props} />);

  /** Re-renders with the latest value captured from onChange calls. */
  const sync = () => {
    if (onChange.mock.calls.length > 0) {
      currentValue = onChange.mock.calls[onChange.mock.calls.length - 1][0] as string;
    }
    rerender(<MaskedSsnInput {...props} value={currentValue} onChange={onChange} />);
  };

  return { onChange, onBlur, sync, rerender };
};

describe("MaskedSsnInput", () => {
  describe("rendering", () => {
    it("renders an input element with the correct id and name", () => {
      render(<MaskedSsnInput {...buildProps()} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "ssn");
      expect(input).toHaveAttribute("name", "ssn");
    });

    it("renders the show/hide toggle button", () => {
      render(<MaskedSsnInput {...buildProps()} />);
      expect(screen.getByRole("button", { name: "Show SSN / ITIN" })).toBeInTheDocument();
    });

    it("displays an empty input when value is empty", () => {
      render(<MaskedSsnInput {...buildProps({ value: "" })} />);
      expect(screen.getByRole("textbox")).toHaveValue("");
    });
  });

  describe("masking", () => {
    it("displays a fully masked SSN when value is provided", () => {
      render(<MaskedSsnInput {...buildProps({ value: "123-45-6789" })} />);
      expect(screen.getByRole("textbox")).toHaveValue(`XXX-XX-XXXX`);
    });

    it("masks a partial SSN value", () => {
      render(<MaskedSsnInput {...buildProps({ value: "123-4" })} />);
      expect(screen.getByRole("textbox")).toHaveValue(`XXX-X`);
    });
  });

  describe("reveal toggle", () => {
    it("shows the unmasked SSN when toggle is activated", async () => {
      const user = userEvent.setup();
      render(<MaskedSsnInput {...buildProps({ value: "123-45-6789" })} />);

      await user.click(screen.getByRole("button", { name: "Show SSN / ITIN" }));

      expect(screen.getByRole("textbox")).toHaveValue("123-45-6789");
    });

    it("re-masks the SSN when toggle is activated a second time", async () => {
      const user = userEvent.setup();
      render(<MaskedSsnInput {...buildProps({ value: "123-45-6789" })} />);

      const toggle = screen.getByRole("button", { name: "Show SSN / ITIN" });
      await user.click(toggle);
      expect(screen.getByRole("textbox")).toHaveValue("123-45-6789");

      await user.click(screen.getByRole("button", { name: "Hide SSN / ITIN" }));
      expect(screen.getByRole("textbox")).toHaveValue("XXX-XX-XXXX");
    });
  });

  describe("input handling", () => {
    it("calls onChange with formatted digits when user types", async () => {
      const user = userEvent.setup();
      const { onChange, sync } = renderControlled();

      await user.click(screen.getByRole("textbox"));
      await user.keyboard("1");
      sync();

      expect(onChange).toHaveBeenCalled();
      const lastCallValue = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(extractDigitsFromValue(lastCallValue as string)).toMatch(/^1/);
    });

    it("limits input to 9 digits in ###-##-#### format", async () => {
      const user = userEvent.setup();
      const { sync } = renderControlled();

      await user.click(screen.getByRole("textbox"));
      await user.keyboard("1234567890");
      sync();

      const displayValue = (screen.getByRole("textbox") as HTMLInputElement).value;
      expect(displayValue).toBe("XXX-XX-XXXX");
    });

    it("strips non-digit characters from typed input", async () => {
      const user = userEvent.setup();
      const { sync } = renderControlled();

      await user.click(screen.getByRole("textbox"));
      await user.keyboard("1a2b3");
      sync();

      const displayValue = (screen.getByRole("textbox") as HTMLInputElement).value;
      expect(displayValue).toBe("XXX");
    });
  });

  describe("paste handling", () => {
    it("calls onChange with formatted value when SSN is pasted", async () => {
      const user = userEvent.setup();
      const { onChange } = renderControlled();

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.paste("123456789");

      expect(onChange).toHaveBeenCalledWith("123-45-6789");
    });

    it("strips non-digits from pasted content", async () => {
      const user = userEvent.setup();
      const { onChange } = renderControlled();

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.paste("123-45-6789");

      expect(onChange).toHaveBeenCalledWith("123-45-6789");
    });

    it("truncates pasted content to 9 digits", async () => {
      const user = userEvent.setup();
      const { onChange } = renderControlled();

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.paste("12345678901234");

      const calledValue = onChange.mock.calls[0][0] as string;
      const digits = calledValue.replace(/\D/g, "");
      expect(digits).toHaveLength(9);
    });

    it("displays pasted value as masked", async () => {
      const user = userEvent.setup();
      const { sync } = renderControlled();

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.paste("123456789");
      sync();

      const displayValue = (screen.getByRole("textbox") as HTMLInputElement).value;
      expect(displayValue).toBe("XXX-XX-XXXX");
    });
  });
});

const extractDigitsFromValue = (value: string): string => value.replace(/\D/g, "");
