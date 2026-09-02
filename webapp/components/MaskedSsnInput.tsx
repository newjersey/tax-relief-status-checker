"use client";

import type { ChangeEvent, ClipboardEvent } from "react";
import { useState, useCallback, useRef, useEffect } from "react";

const MASK_CHARACTER = "X";

export interface MaskedSsnInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onBlur: () => void;
  readonly name: string;
  readonly id: string;
  readonly required?: boolean;
  readonly "aria-invalid"?: "true" | "false";
  readonly "aria-describedby"?: string;
}

const extractDigits = (input: string): string => input.replace(/\D/g, "");

const formatAsSSN = (digits: string): string => {
  const limited = digits.slice(0, 9);
  if (limited.length <= 3) return limited;
  if (limited.length <= 5) return `${limited.slice(0, 3)}-${limited.slice(3)}`;
  return `${limited.slice(0, 3)}-${limited.slice(3, 5)}-${limited.slice(5)}`;
};

const maskFormattedSSN = (formatted: string): string => formatted.replace(/\d/g, MASK_CHARACTER);

export const MaskedSsnInput = (props: MaskedSsnInputProps) => {
  const { value, onChange, onBlur, name, id, required } = props;
  const ariaInvalid = props["aria-invalid"];
  const ariaDescribedby = props["aria-describedby"];

  const [isRevealed, setIsRevealed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number | null>(null);

  const displayValue = isRevealed ? value : maskFormattedSSN(value);

  useEffect(() => {
    if (cursorPositionRef.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
      cursorPositionRef.current = null;
    }
  });

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const rawInput = event.target.value;
      const digits = extractDigits(rawInput);
      const formatted = formatAsSSN(digits);
      const previousLength = value.length;
      const newLength = formatted.length;
      const cursorPos = event.target.selectionStart ?? newLength;

      const cursorAdjustment = newLength - previousLength;
      cursorPositionRef.current = Math.max(
        0,
        cursorPos + (cursorAdjustment > 1 ? cursorAdjustment - 1 : 0),
      );

      onChange(formatted);
    },
    [onChange, value],
  );

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const pastedText = event.clipboardData.getData("text");
      const digits = extractDigits(pastedText);
      const formatted = formatAsSSN(digits);
      cursorPositionRef.current = formatted.length;
      onChange(formatted);
    },
    [onChange],
  );

  const toggleReveal = useCallback(() => {
    setIsRevealed((previous) => !previous);
  }, []);

  const toggleLabel = isRevealed ? "Hide SSN / ITIN" : "Show SSN / ITIN";

  return (
    <div className="usa-form-group">
      <input
        ref={inputRef}
        className="usa-input"
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={displayValue}
        onChange={handleChange}
        onPaste={handlePaste}
        onBlur={onBlur}
        required={required}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        maxLength={11}
      />
      <button
        type="button"
        className="usa-button usa-button--unstyled margin-top-05"
        onClick={toggleReveal}
        aria-pressed={isRevealed}
        aria-label={toggleLabel}
      >
        {toggleLabel}
      </button>
    </div>
  );
};
