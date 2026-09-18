"use client"
import Input from "@/components/shared/Input";
import { useState } from "react";
import Select from "@/components/shared/Select";
import FileInput from "@/components/shared/FileInput";
import Image from "next/image";
import { Country, State } from "country-state-city";
import Guaranty from "@/components/GuarantorForm/Guaranty";
import Checkbox from "@/components/shared/CheckBox";
import ModalLayout from "@/utils/ModalLayout";
import ConsentModal from "@/components/shared/Consent";
import ModalLayoutPopUp from "@/utils/ModalLayoutPopUp";
import { useForm } from "react-hook-form";
import {guarantorFormSchema} from "@/utils/validation/guarantorForm"
import type {guarantorFormValues} from "@/utils/validation/guarantorForm"
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "@/utils/Loader";
import SuccessModal from "@/components/shared/SuccessModal"


const GuarantorForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showConsent, setShowConsent] = useState<boolean>(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<guarantorFormValues>({
    resolver: zodResolver(guarantorFormSchema),
    defaultValues: {
      validID: [],
      picture: [],
      signature: [],
    },
  });

  const onSubmit = async (data: guarantorFormValues) => {
    setLoading(true)
    console.log(data)
    setTimeout(()=>{
        setLoading(false);
        setShowSuccessModal(true)
    }, 8000)
  }

  const stateOptions = State.getStatesOfCountry("NG").map((state)=> {
    return {
      label: state.name,
      value: state.name.toLocaleLowerCase()
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F8FB] px-3 py-6 sm:px-5 sm:py-10">
      {loading && (
        <ModalLayout setModal={setLoading} addclas="w-fit">
          <Loader title="processing" />
        </ModalLayout>
      )}
      {
        showSuccessModal && (
         <ModalLayoutPopUp setModal={setShowSuccessModal} addclas="w-fit">
            <SuccessModal
                title="Guarantor Form" 
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
      <div className="w-full max-w-[674px] bg-white px-4 py-6 sm:px-6 sm:py-10 flex flex-col items-center justify-center gap-5 rounded-[12px]">

          <Image 
            src="/fob-image.png"
            alt="fob-image"
            width={200}
            height={200}
          />

          <h2 className="text-[20px] font-semibold text-center">
            FOB GUARANTOR’S FORM - (FAMILY MEMBERS ARE NOT ACCEPTED)
          </h2>
         
         {/* form */}
          <form className="w-full pt-4.5 flex flex-col gap-9.5"
                onSubmit={handleSubmit(onSubmit)}>
            {/* employee personal information (bearer) */}
            <div className="w-full flex flex-col gap-5">
                <h2 className="text-[15px] text-center">
                  EMPLOYEES PERSONAL INFORMATION (BEARER)
                </h2>

               <Input 
                    label="Name" 
                    required
                    type="text" 
                    placeholder="Enter Employee Name"
                    {...register("employeeName")}
                    error={errors.employeeName && errors.employeeName?.message}
                />

                <Input 
                    label="Address" 
                    required
                    type="text" 
                    placeholder="Enter Employee Address"
                    {...register("employeeAddress")}
                    error={errors.employeeAddress && errors.employeeAddress?.message}
                />

                <Select 
                  label="Gender"
                  required
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                  {...register("employeeGender")}
                  error={errors.employeeGender && errors.employeeGender?.message}
                />

                <Input 
                    label="Relationship with Employee" 
                    required
                    type="text" 
                    placeholder="Enter Relationship with Employee"
                    {...register("relationship")}
                    error={errors.relationship && errors.relationship?.message}
                />

                 <Select 
                  label="Years of Relationship with Employee"
                  required
                  options={[
                    { label: "Less than 1 year", value: "less_than_1_year" },
                    { label: "1-3 years", value: "1_to_3_years" },
                    { label: "More than 3 years", value: "more_than_3_years" },
                  ]}
                  {...register("yearsOfRelationship")}
                  error={errors. yearsOfRelationship && errors. yearsOfRelationship?.message}
                />
            </div>
            
            {/* guarantor personal information */}
            <div className="w-full flex flex-col gap-5">
                <h2 className="text-[15px] text-center">
                  GUARANTOR’S PERSONAL INFORMATION
                </h2>

                <FileInput
                  label="Upload Valid Means of Identification"
                  required
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple={false} 
                  description= "Accepted ID: Voters Card, International Passport, National ID (NIMC)"
                  onFilesChange={(files) => setValue("validID", files, { shouldValidate: true })}
                  error={errors.validID && errors.validID?.message}
                />

                 <FileInput
                  label="Upload Picture"
                  required
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple={false} 
                  description= "Guarantor's Passport Size Photo"
                  onFilesChange={(files) => setValue("picture", files, { shouldValidate: true })}
                  error={errors.picture && errors.picture?.message}
                />

               <Input 
                    label="First Name" 
                    required
                    type="text" 
                    placeholder="Enter First Name"
                    {...register("firstName")}
                    error={errors.firstName && errors.firstName?.message}
                />

                <Input 
                    label="Surname" 
                    required
                    type="text" 
                    placeholder="Enter Surname"
                    {...register("surname")}
                    error={errors.surname && errors.surname?.message}
                />
               
                <Input 
                    label="Other Name"
                    required 
                    type="text" 
                    placeholder="Enter Other Name"
                    {...register("otherName")}
                    error={errors.otherName && errors.otherName?.message}
                />

                <Input 
                    label="Date of Birth"
                    required 
                    type="date" 
                    placeholder="Enter Date of Birth"
                    {...register("dateOfBirth")}
                    error={errors.dateOfBirth && errors.dateOfBirth?.message}
                />

                <Select 
                  label="Gender"
                  required
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                  {...register("guarGender")}
                  error={errors.guarGender && errors.guarGender?.message}
                />

                <Select 
                  label="Marital Status"
                  required
                  options={[
                    { label: "Single", value: "single" },
                    { label: "Married", value: "married" },
                    { label: "Divorced", value: "divorced" },
                  ]}
                  {...register("maritalStatus")}
                  error={errors.maritalStatus && errors.maritalStatus?.message}
                />

                <Select 
                  label="State of Origin"
                  required
                  options={stateOptions}
                  {...register("stateOfOrigin")}
                  error={errors.stateOfOrigin && errors.stateOfOrigin?.message}
                />

                <Input 
                    label="Email"
                    required 
                    type="email" 
                    placeholder="Enter Guarantor's Email Address"
                    {...register("email")}
                    error={errors.email && errors.email?.message}
                />

                <Input 
                    label="Telephone Number"
                    required 
                    type="tel" 
                  inputMode="numeric"
                  maxLength={11}
                    placeholder="Enter Guarantor's Telephone Number"
                    {...register("phoneNumber")}
                    error={errors.phoneNumber && errors.phoneNumber?.message}
                />

                <Input 
                    label="Telephone Number 2 (Optional)"
                    type="tel" 
                  inputMode="numeric"
                  maxLength={11}
                    placeholder="Enter Guarantor's Telephone Number"
                    {...register("phoneNumberTwo")}
                    error={errors.phoneNumberTwo && errors.phoneNumberTwo?.message}
                />

                <Select 
                  label="Occupation"
                  required
                  options={[
                    { label: "Worker", value: "worker" },
                    { label: "Employee", value: "employee" },
                    { label: "Self-Employed", value: "self-employed" },
                  ]}
                  {...register("occupation")}
                  error={errors.occupation && errors.occupation?.message}
                />
            </div>

           <div className="w-full flex flex-col gap-5">
                <h2 className="text-[15px] text-center">
                  GUARANTOR’S HOME ADDRESS INFORMATION
                </h2>

               <Input 
                    label="Home Address" 
                    required
                    type="text" 
                    placeholder="Enter Address"
                    {...register("guarHomeAddress")}
                    error={errors.guarHomeAddress && errors.guarHomeAddress?.message}
                />

                 <Select 
                  label="State"
                  required
                  options={stateOptions}
                  {...register("guarHomeState")}
                  error={errors.guarHomeState && errors.guarHomeState?.message}
                />

                <Input 
                    label="LGA" 
                    required
                    type="text" 
                    placeholder="Enter LGA"
                    {...register("guarHomeLga")}
                    error={errors.guarHomeLga && errors.guarHomeLga?.message}
                />

                <Input 
                    label="City" 
                    required
                    type="text" 
                    placeholder="Enter City"
                    {...register("guarHomeCity")}
                    error={errors.guarHomeCity && errors.guarHomeCity?.message}
                />
            </div>

           <div className="w-full flex flex-col gap-5">
                <h2 className="text-[15px] text-center">
                  GUARANTOR’S OFFICE ADDRESS INFORMATION
                </h2>

               <Input 
                    label="Office Address" 
                    required
                    type="text" 
                    placeholder="Enter Address"
                    {...register("guarOfficeAddress")}
                    error={errors.guarOfficeAddress && errors.guarOfficeAddress?.message}
                />

                <Select 
                  label="State"
                  required
                  options={stateOptions}
                  {...register("guarOfficeState")}
                  error={errors.guarOfficeState && errors.guarOfficeState?.message}
                />

                <Input 
                    label="LGA" 
                    required
                    type="text" 
                    placeholder="Enter LGA"
                    {...register("guarOfficeLga")}
                    error={errors.guarOfficeLga && errors.guarHomeLga?.message}
                />

                <Input 
                    label="City" 
                    required
                    type="text" 
                    placeholder="Enter City"
                    {...register("guarOfficeCity")}
                    error={errors.guarOfficeCity && errors.guarOfficeCity?.message}
                />
            </div>

            <div className="w-full flex flex-col gap-3">
              <Guaranty
                label="GUARANTY"
                required
                {...register("checkGuarantorBox")}
                error={errors.checkGuarantorBox && errors.checkGuarantorBox?.message}
              />
              <p>
                I hereby stand as a guarantor in favor of the bearer concerning employment 
                or assignment to be offered or assigned to him/her by your organization Fiberone
                 in line with his profession or capacity as required by your company. 
                 I consider the bearer fit to execute any legal or career-based position or
                  appointment within your firm to a satisfactory level. However, should the
                   bearer default in his responsibilities to your firm through any fraudulent
                    or dishonest act which wrongly portrays the image of the company, I will
                     accept full responsibility for any loss or losses sustained.  
              </p>
            </div>

            <div className="w-full flex flex-col gap-5">
                <FileInput
                  label="Upload Your Signature"
                  required
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple={false} 
                  description= "Accepted Signature: Scanned or Digital Signature"
                  onFilesChange={(files) => setValue("signature", files, { shouldValidate: true })}
                  error={errors.signature && errors.signature?.message}
                />

                <Input 
                    label="Signature Date" 
                    required
                    type="date" 
                    placeholder="Enter Signature Date"
                    {...register("signatureDate")}
                    error={errors.signatureDate && errors.signatureDate?.message}
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
          

            <button className="bg-[rgb(0,176,240)] text-white py-3.25 w-full rounded-sm font-semibold cursor-pointer"
              disabled={loading || isSubmitting}
              type="submit">
              Submit
            </button>

          </form> 
          
      </div>
    </div>
  )
}

export default GuarantorForm
