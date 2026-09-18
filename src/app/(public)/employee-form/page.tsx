
"use client";

import { useQueryState, parseAsInteger } from "nuqs";
import FormStepOne from '@/components/EmployeeForm/FormStepOne'
import FormStepTwo from '@/components/EmployeeForm/FormStepTwo'
import { Suspense, useEffect } from "react";



const STEPS = {
  page_one: 1,
  page_two: 2,
} as const;

const EmployeeFormContent = () => {
  const [currentStep, setCurrentStep] = useQueryState(
    "step",
    parseAsInteger.withDefault(STEPS.page_one)
  );

  const handleNextStep = () => {
    setCurrentStep(STEPS.page_two);
  };

  const handlePreviousStep = () => {
    setCurrentStep(STEPS.page_one);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);
  

  return (
    <div className="w-full">

      {currentStep === STEPS.page_one && (
        <FormStepOne onNext={handleNextStep} />
      )}

      {currentStep === STEPS.page_two && (
        <FormStepTwo onPrevious={handlePreviousStep} />
      )}
    </div>
  );
}

const EmployeeForm = () => (
  <Suspense fallback={<div className="min-h-screen bg-[#F2F8FB]" />}>
    <EmployeeFormContent />
  </Suspense>
);

export default EmployeeForm