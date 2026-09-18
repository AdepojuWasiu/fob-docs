"use client"
import { cn } from "@/utils/cn";
import React from "react";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  password?: boolean;
  type?: string;
  label?: string;
  placeholder?: string;
  error?: string | boolean;
  required?: boolean;
  name?: string;
  value?: string | number | readonly string[] | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ 
  password,
  type = "text",
  label,
  placeholder,
  error,
  required = false,
  ...props
}, ref) => {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full flex flex-col gap-1 text-md font-medium relative">
      <label className="block mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {password ? (
        <>
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={cn(
              `border p-[13px] border-[#E4E7EC] flex-1 w-full focus:outline-none rounded-sm`,
              error ? "border-red-500" : ""
            )}
            placeholder={placeholder}
            required={false}
            {...props}
          />
          <button
            type="button"
            className="absolute right-3 top-13.5 transform -translate-y-1/2 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Eye size={15} className="cursor-pointer" />
            ) : (
              <EyeClosed size={15} className="cursor-pointer" />
            )}
          </button>
        </>
      ) : (
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          required={false}
          className={cn(
            `border-[1px] p-[13px] border-[#E4E7EC] flex-1 w-full focus:outline-none rounded-sm`,
            error ? "border-red-500" : "",
            type === "number" && "appearance-none",
            type === "number" ? "w-32" : "w-full"
          )}
          {...props}
        />
      )}
        
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;

