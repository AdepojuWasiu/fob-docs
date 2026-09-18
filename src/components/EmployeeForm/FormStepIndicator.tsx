
"use client";

import { cn } from "@/utils/cn";

interface FormStepIndicatorProps {
  currentStep: number;
}

const steps = [
  {
    number: 1,
    title: "Page 1",
  },
  {
    number: 2,
    title: "Page 2",
  },
];

const FormStepIndicator = ({
  currentStep,
}: FormStepIndicatorProps) => {
  return (
    <div className="w-full flex items-center justify-center mb-2">
      {steps.map((step, index) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <div
            key={step.number}
            className="flex items-center"
          >
            {/* Step */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "font-semibold text-sm transition-all duration-300",
                  isActive || isCompleted
                    ? "bg-[rgb(0,176,240)] text-white"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {isCompleted ? "✓" : step.number}
              </div>

              <span
                className={cn(
                  "mt-2 text-sm font-medium",
                  isActive || isCompleted
                    ? "text-gray-800"
                    : "text-gray-400"
                )}
              >
                {step.title}
              </span>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-24 h-[2px] mx-4 mb-6 transition-all duration-300",
                  currentStep > step.number
                    ? "bg-[rgb(0,176,240)]"
                    : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FormStepIndicator;

