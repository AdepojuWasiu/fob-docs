"use client";

import { cn } from "@/utils/cn";
import React from "react";

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  required?: boolean;
  options: { label: string; value: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      required,
      options,
      className,
      defaultValue = "",
      ...props
    },
    ref
  ) => (
    <div className="flex flex-col space-y-1">
      <label className="block text-md font-medium">
        {label}
        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <select
        ref={ref}
        {...props}
        defaultValue={defaultValue}
        className={cn(
          "border rounded-sm p-3.25 text-md focus:outline-none focus:ring border-gray-200 mt-1",
          !defaultValue
            ? "text-gray-500"
            : "text-gray-700",
          className
        )}
      >
        <option value="">
          Select {label}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
);

Select.displayName = "Select";

export default Select;