// utils/numberInput.ts
import type React from "react";

export const blockInvalidNumberKeys = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  if (["-", "+", "e", "E"].includes(e.key)) {
    e.preventDefault();
  }
};

export const blockNegativeNumberPaste = (
  e: React.ClipboardEvent<HTMLInputElement>
) => {
  const pastedValue = e.clipboardData.getData("text");

  if (pastedValue.includes("-") || Number(pastedValue) < 0) {
    e.preventDefault();
  }
};

export const sanitizeNonNegativeNumber = (value: string) => {
  if (value === "") return "";

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) return "";

  if (numericValue < 0) return "0";

  return value;
};