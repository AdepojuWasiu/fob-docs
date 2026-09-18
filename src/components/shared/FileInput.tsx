"use client";
import React, { useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface FileInputProps {
  description?: string;
  label?: string;
  error?: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  onFilesChange?: (files: File[]) => void;
}

const FileInput = ({
  description,
  label,
  error,
  required = false,
  accept,
  multiple = true,
  maxFiles,
  className,
  onFilesChange,
}: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) return;

    let updatedFiles = [...files, ...selectedFiles];

    // Prevent exceeding maxFiles
    if (maxFiles) {
      updatedFiles = updatedFiles.slice(0, maxFiles);
    }

    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);

    // Reset input so the user can select
    // the same file again if they want
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "w-full flex flex-col gap-2 text-md font-medium ",
        className
      )}
    >
      {label && (
        <label className="block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* File picker */}
      <div
        onClick={openFilePicker}
        className={cn(
          "w-full border border-dashed rounded-sm",
          "p-4 cursor-pointer",
          "flex flex-col items-center justify-center",
          "hover:bg-gray-50 transition",
          error ? "border-red-500" : "border-gray-300"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            Click to upload
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Select a file from your device
          </p>
          {accept && (
            <p className="text-xs text-gray-400 mt-1">
              Accepted file types: {accept}
            </p>
          )}

          {maxFiles && (
            <p className="text-xs text-gray-400 mt-1">
              Maximum {maxFiles} file{maxFiles > 1 ? "s" : ""}
            </p>
          )}
        </div>
        {description && (
          <p className="text-center text-md">
           {description}
          </p>
        )}
      </div>


      {/* Selected files */}
      {files.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between border border-gray-200 rounded-[10px] p-3 bg-white"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* File icon */}
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  📄
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {file.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="ml-3 w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition"
                aria-label={`Remove ${file.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileInput;
