"use client"
import Input from "@/components/shared/Input";
import { useState } from "react";
import Select from "@/components/shared/Select";
import FileInput from "@/components/shared/FileInput";
import Image from "next/image";
import Checkbox from "@/components/shared/CheckBox";
import ModalLayout from "@/utils/ModalLayout";
import ConsentModal from "@/components/shared/Consent";
import ModalLayoutPopUp from "@/utils/ModalLayoutPopUp";
import FormStepIndicator from '@/components/EmployeeForm/FormStepIndicator';
import { useForm } from "react-hook-form";
import {employeeFormTwoSchema} from "@/utils/validation/employeeFormTwo";
import type { employeeFormTwoValues} from "@/utils/validation/employeeFormTwo";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "@/utils/Loader";
import SuccessModal from "@/components/shared/SuccessModal";
import {useEmployeeFormOneStore} from "@/store/useEmployeeStore"


interface FormStepTwoProps {
  onPrevious: () => void;
}

const FormStepTwo = ({ onPrevious }: FormStepTwoProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showConsent, setShowConsent] = useState<boolean>(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const {formOne} = useEmployeeFormOneStore()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<employeeFormTwoValues>({
    resolver: zodResolver(employeeFormTwoSchema),
    defaultValues: {
      picture: [],
      academicCertificate: [],
      nyscCertificate: [],
      birthCertificate: [],
      validId: [],
      olevelCertificate: [],
      otherDocuments: []
    },
  });

  const onSubmit = async (data: employeeFormTwoValues) => {
    setLoading(true)
    console.log(data)
    console.log(formOne)
    setTimeout(()=>{
        setLoading(false);
        setShowSuccessModal(true)
    }, 8000)
  }

   const sickness = [
    {label: "Cough", value: "cough"},
    {label: "Fever", value: "fever"},
    {label: "Jaundice", value: "jaundice"},
    {label: "Difficult In Breathing", value: "difficult_in_breathing"},
    {label: "Sneezing", value: "sneezing"},
    {label: "Hepatitis B", value: "hepatitis_b"},
    {label: "Tuberculosis", value: "tuberculosis"},
    {label: "Cancer", value: "cancer"},
    {label: "Epilepsy", value: "epilepsy"},
    {label: "None Of The Above", value: "none"}
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F8FB] py-[50px]">
     {loading && (
        <ModalLayout setModal={setLoading} addclas="w-fit">
          <Loader title="processing" />
        </ModalLayout>
      )}
      {
        showSuccessModal && (
         <ModalLayoutPopUp setModal={setShowSuccessModal} addclas="w-fit">
            <SuccessModal
                title="Employee Bio Data " 
                onClose={() => setShowSuccessModal(false)}
            />
         </ModalLayoutPopUp> 
           
        )
      }
      {showConsent && (
        <ModalLayoutPopUp
          setModal={setShowConsent}
          addclas="w-fit"
        >
          <ConsentModal
            onAccept={() => {
              setConsentAccepted(true);
              setValue("consentCheckBox", true, { shouldValidate: true });
              setShowConsent(false);
            }}
            onReject={() => {
              setConsentAccepted(false);
              setValue("consentCheckBox", false, { shouldValidate: true });
              setShowConsent(false);
            }}
          />
        </ModalLayoutPopUp> 
      )}
      <div className="w-full max-w-[674px] bg-white px-[2.5vw] py-[40px] flex flex-col items-center justify-center gap-5 rounded-[12px]"> 

          <Image 
            src="/fob-image.png"
            alt="fob-image"
            width={200}
            height={200}
          />

          <h2 className="text-[20px] font-semibold text-center">
            FOB Employee Bio Data Form
          </h2>

          <FormStepIndicator currentStep={2} />
         
         {/* form */}
          <form className="w-full pt-4.5 flex flex-col gap-9.5"
           onSubmit={handleSubmit(onSubmit)}>
            {/* employee personal information (bearer) */}
            <div className="w-full flex flex-col gap-5">
                <h2 className="text-[15px] text-center">
                  PENSION DETAILS
                </h2>

               <Input 
                    label="Name of PFA" 
                    required
                    type="text" 
                    placeholder="Enter PFA Name"
                    {...register("pfaName")}
                    error={errors.pfaName && errors.pfaName?.message}
                />

                <Input 
                    label="PIN" 
                    required
                    type="text" 
                    placeholder="e.g PEN123456789012"
                    {...register("pin")}
                    error={errors.pin && errors.pin?.message}
                />

                <Input 
                    label="Tax Identification Number(TIN)" 
                    required
                    type="text" 
                    placeholder="Enter Your TIN"
                    {...register("tin")}
                    error={errors.tin && errors.tin?.message}
                />
            </div>
            
            {/* guarantor personal information */}
            <div className="w-full flex flex-col gap-5">
                <h2 className="text-[15px] text-center">
                  PERSONAL BANK DETAILS
                </h2>

               <Input 
                    label="Account Holder" 
                    required
                    type="text" 
                    placeholder="Enter Bank Account Holder Name"
                    {...register("accountHolder")}
                    error={errors.accountHolder && errors.accountHolder?.message}
                />

                <Input 
                    label="Bank Name" 
                    required
                    type="text" 
                    placeholder="Enter Bank Name"
                    {...register("bankName")}
                    error={errors.bankName && errors.bankName?.message}
                />
               
                <Input 
                    label="Bank Account Number"
                    required 
                    type="text" 
                    maxLength={10}
                    placeholder="Enter Bank Account Number"
                    {...register("accountNumber")}
                    error={errors.accountNumber && errors.accountNumber?.message}
                />

                <Input 
                    label="Tax ID PIN"
                    required 
                    type="text" 
                    placeholder="Enter Tax ID PIN"
                    {...register("taxIdPin")}
                    error={errors.taxIdPin && errors.taxIdPin?.message}
                />

              <Checkbox
                label="I understand that any monies due are to be paid using the bank details shown above. Should any information be incorrect, I agree to wait until refunds have been returned before a reissuing of monies is made by the company."
                required
                 {...register("moneyCheckBox")}
                 error={errors.moneyCheckBox && errors.moneyCheckBox?.message}
              />
            </div>


           <div className="w-full flex flex-col gap-5">
                <h2 className="text-[15px] text-center">
                  HEALTH INFORMATION
                </h2>

                <Select 
                  label="Sickness Within The Last 30days"
                  required
                  options={sickness}
                  {...register("sickness")}
                  error={errors.sickness && errors.sickness?.message}
                />

                <Checkbox
                  label="I declare that the health information provided above is correct."
                  required
                   {...register("sicknessCheckBox")}
                  error={errors.sicknessCheckBox && errors.sicknessCheckBox?.message}
                />
            </div>

            <div className="w-full flex flex-col gap-5">
                <h2 className="text-[15px] text-center">
                  UPLOAD DOCUMENTS
                </h2>

                <FileInput
                  label="Upload Your Picture"
                  required
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple={false} 
                  description= "Passport Size Photo"
                  onFilesChange={(files) => setValue("picture", files, { shouldValidate: true })}
                  error={errors.picture && errors.picture?.message}
                />

                <FileInput
                  label="Academic Certificate"
                  required
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple={false} 
                  description= "Accepted Certificate: Bachelor Degree Or HND or ND"
                  onFilesChange={(files) => setValue("academicCertificate", files, { shouldValidate: true })}
                  error={errors.academicCertificate && errors.academicCertificate?.message}
                />

                 <FileInput
                  label="Nysc Certificate"
                  required
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple={false} 
                  description= "Your NYSC Certificate or Exemption Letter"
                  onFilesChange={(files) => setValue("nyscCertificate", files, { shouldValidate: true })}
                  error={errors.nyscCertificate && errors.nyscCertificate?.message}
                />

                <FileInput
                  label="Birth Certificate"
                  required
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple={false} 
                  description= "Your Birth Certificate"
                  onFilesChange={(files) => setValue("birthCertificate", files, { shouldValidate: true })}
                  error={errors.birthCertificate && errors.birthCertificate?.message}
                />

                <FileInput
                  label="OLevel certificate"
                  required
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple={false} 
                  description= "Accepted Certificate: WAEC or NECO or GCE or NABTEB"
                  onFilesChange={(files) => setValue("olevelCertificate", files, { shouldValidate: true })}
                  error={errors.olevelCertificate && errors.olevelCertificate?.message}
                />

                <FileInput
                  label="Valid Means Of Identification"
                  required
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple={false} 
                  description= "Accepted ID: NIMC, Driver Licence, Voters Card, International Passport"
                  onFilesChange={(files) => setValue("validId", files, { shouldValidate: true })}
                  error={errors.validId && errors.validId?.message}
                />

                <FileInput
                  label="Other Documents"
                  required
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple={true} 
                  description= "Upload the following documents: Signed Offer Letter, CV, Masters Certificate(if you have master degree) NOTE: Failure to submit all documents stated here invalidates this form."
                  onFilesChange={(files) => setValue("otherDocuments", files, { shouldValidate: true })}
                  error={errors.otherDocuments && errors.otherDocuments?.message}
                />
   
            </div>

            <Checkbox
              label="By clicking the submit button, I agree to Consent"
              required
              {...register("consentCheckBox")}
              error={errors.consentCheckBox && errors.consentCheckBox?.message}
              checked={consentAccepted}
              onChange={(e) => {
                if (e.target.checked) {
                  setShowConsent(true);
                } else {
                  setConsentAccepted(false);
                  setValue("consentCheckBox", false, { shouldValidate: true });
                }
              }}
            />

            <div className="flex gap-6 px-8">
              <button
                type="button"
                onClick={onPrevious}
                className="border border-gray-600 py-3.25 w-full rounded-sm font-semibold cursor-pointer"
              >
                Back
              </button>

              <button
                type="submit"
                className="bg-[rgb(0,176,240)] text-white py-3.25 w-full rounded-sm font-semibold cursor-pointer"
              >
                Submit
              </button>
            </div>

          </form> 
          
      </div>
    </div>
  )
}

export default FormStepTwo
