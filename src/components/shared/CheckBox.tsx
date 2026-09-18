
"use client";

import { cn } from "@/utils/cn";
import React from "react";

interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, required, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            className={cn(
              "mt-1 h-4 w-4",
              "rounded border-gray-300",
              "text-blue-600",
              "focus:ring-blue-500",
              "cursor-pointer",
              className
            )}
            {...props}
          />

          <span className="text-md text-gray-700">
            {label}

            {required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </span>
        </label>

        {error && (
          <p className="text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;

