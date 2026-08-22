import { useRef, useEffect, type KeyboardEvent, type ClipboardEvent, type ChangeEvent } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  hasError = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const digits = value.split("").slice(0, length);
  while (digits.length < length) {
    digits.push("");
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    const nextValue = newDigits.join("");
    onChange(nextValue);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (nextValue.length === length && onComplete) {
      onComplete(nextValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, length);
    if (pastedData) {
      onChange(pastedData);
      const nextFocus = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
      if (pastedData.length === length && onComplete) {
        onComplete(pastedData);
      }
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-2">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          className={`h-12 w-11 sm:h-14 sm:w-12 text-center text-xl font-bold rounded-xl border transition-all duration-150 focus:outline-hidden ${
            hasError
              ? "border-red-500/80 bg-red-500/10 text-red-200 focus:ring-2 focus:ring-red-500/40"
              : digit
              ? "border-indigo-500/80 bg-indigo-500/10 text-white shadow-sm shadow-indigo-500/20"
              : "border-white/15 bg-white/5 text-white hover:border-white/25 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
          }`}
        />
      ))}
    </div>
  );
}

export default OtpInput;
