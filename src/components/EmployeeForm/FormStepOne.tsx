"use client"
import Input from "@/components/shared/Input";
import Select from "@/components/shared/Select";
import Image from "next/image";
import { Country, State } from "country-state-city";
import FormStepIndicator from '@/components/EmployeeForm/FormStepIndicator';
import { useForm } from "react-hook-form";
import {employeeFormOneSchema} from "@/utils/validation/employeeFormOne"
import type { employeeFormOneValues} from "@/utils/validation/employeeFormOne"
import { zodResolver } from "@hookform/resolvers/zod";
import {useEmployeeFormOneStore} from "@/store/useEmployeeStore";

interface FormStepOneProps {
  onNext: () => void;
}

const FormStepOne = ({ onNext }: FormStepOneProps) => {
  const {formOne, setFormOne} = useEmployeeFormOneStore()

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<employeeFormOneValues>({
      resolver: zodResolver(employeeFormOneSchema),
      defaultValues: {
        firstName: formOne?.firstName,
        lastName: formOne?.lastName,
        middleName: formOne?.middleName,
        dateOfBirth: formOne?.dateOfBirth,
        gender: formOne?.gender,
        nin: formOne?.nin,
        jobTitle: formOne?.jobTitle,
        employmentType: formOne?.employmentType,
        department: formOne?.department,
        maritalStatus: formOne?.maritalStatus,
        nationality: formOne?.nationality,
        stateOfOrigin: formOne?.stateOfOrigin,
        address: formOne?.address,
        state: formOne?.state,
        lga: formOne?.lga,
        city: formOne?.city,
        email: formOne?.email,
        phoneNumber: formOne?.phoneNumber,
        phoneNumberTwo: formOne?.phoneNumberTwo,
        kinFirstName: formOne?.kinFirstName,
        kinLastName: formOne?.kinLastName,
        kinMiddleName: formOne?.kinMiddleName,
        kinGender: formOne?.kinGender,
        kinAddress: formOne?.kinAddress,
        kinRelationship: formOne?.kinRelationship,
        kinPhoneNumber: formOne?.kinPhoneNumber,
        kinPhoneNumberTwo: formOne?.kinPhoneNumberTwo
      }
    });

    const onSubmit = async (data: employeeFormOneValues) => {
      console.log(data)
      setFormOne(data)
      onNext()
    }

  const stateOptions = State.getStatesOfCountry("NG").map((state)=> {
    return {
      label: state.name,
      value: state.name
    }
  })

  const countryOptions = Country.getAllCountries().map((country)=> {
    return {
      label: country.name,
      value: country.name
    }
  })

  const departments = [
    {label: "Commercial", value: "commercial"},
    {label: "Corporate Services", value: "corporate_services"},
    {label: "Finance", value: "finance"},
    {label: "Internal Audit, Risk and BPSQ", value: "Internal_audit_risk_bpsq"},
    {label: "Regulatory and Public Relations", value: "regulatory_Public_relations"},
    {label: "Technology", value: "technology"}
  ]

  const relationships = [
    {label: "Father", value: "father"},
    {label: "Mother", value: "mother"},
    {label: "Son", value: "son"},
    {label: "Daughter", value: "daughter"},
    {label: "Husband", value: "husband"},
    {label: "Wife", value: "wife"},
    {label: "Brother", value: "brother"},
    {label: "Sister", value: "sister"},
    {label: "GrandFather", value: "grand_father"},
    {label: "GrandMother", value: "grand_mother"},
    {label: "GrandSon", value: "grand_son"},
    {label: "Uncle", value: "uncle"},
    {label: "Aunty", value: "aunty"},
    {label: "Newphew", value: "newphew"},
    {label: "Niece", value: "niece"},
    {label: "Cousins", value: "cousins"},
    {label: "Friend", value: "friend"},
    {label: "Others", value: "others"}
  ]


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F8FB] px-3 py-6 sm:px-5 sm:py-10">

      <div className="w-full max-w-[674px] bg-white px-4 py-6 sm:px-6 sm:py-10 flex flex-col items-center justify-center gap-5 rounded-[12px]">

          <Image 
            src="/fob-image.png"
            alt="fob-image"
            width={200}
            height={200}
          />

          <h2 className="text-[20px] font-semibold text-center">
            FOB Employee Bio Data Form
          </h2>

         <FormStepIndicator currentStep={1} />
         
         {/* form */}
          <form className="w-full pt-4.5 flex flex-col gap-9.5"
           onSubmit={handleSubmit(onSubmit)}>
            {/* employee personal details */}
            <div className="w-full flex flex-col gap-5">
                <h2 className="text-[15px] text-center">
                  PERSONAL DETAILS
                </h2>

                 <Input 
                    label="First Name"
                    required 
                    type="text" 
                    placeholder="Enter First Name"
                    {...register("firstName")}
                    error={errors.firstName && errors.firstName?.message}
                />

                <Input 
                    label="Last Name" 
                    required
                    type="text" 
                    placeholder="Enter Last Name"
                    {...register("lastName")}
                    error={errors.lastName && errors.lastName?.message}
                />

                <Input 
                    label="Middle Name" 
                    required
                    type="text" 
                    placeholder="Enter Middle Name"
                    {...register("middleName")}
                    error={errors.middleName && errors.middleName?.message}
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
                  {...register("gender")}
                  error={errors.gender && errors.gender?.message}
                />

                <Input 
                  label="National Identification Number (NIN)"
                  required 
                  type="text" 
                  maxLength={11}
                  inputMode="numeric"
                  placeholder="Enter Your NIN"
                  {...register("nin")}
                  error={errors.nin && errors.nin?.message}
                />

                <Input 
                  label="Job Title"
                  required 
                  type="text" 
                  placeholder="Enter Your Job Title"
                  {...register("jobTitle")}
                  error={errors.jobTitle && errors.jobTitle?.message}
                />

                <Select 
                  label="Employment Type"
                  required
                  options={[
                    { label: "Full-Time Employee", value: "full_time" },
                    { label: "Contract", value: "contract" },
                    { label: "Intern", value: "intern" },
                    { label: "Apprentice", value: "apperentice" },
                  ]}
                  {...register("employmentType")}
                  error={errors.employmentType && errors.employmentType?.message}
                />

                <Select 
                  label="Department"
                  required
                  options={departments}
                  {...register("department")}
                  error={errors.department && errors.department?.message}
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
                  label="Nationality"
                  required
                  options={countryOptions}
                  {...register("nationality")}
                  error={errors.nationality && errors.nationality?.message}
                />

                <Select 
                  label="State of Origin"
                  required
                  options={stateOptions}
                  {...register("stateOfOrigin")}
                  error={errors.stateOfOrigin && errors.stateOfOrigin?.message}
                />     
            </div>
            
            {/* guarantor personal information */}
            <div className="w-full flex flex-col gap-5">
                <h2 className="text-[15px] text-center">
                  CONTACT DETAILS
                </h2>

                <Input 
                    label="Address" 
                    required
                    type="text" 
                    placeholder="Enter Address"
                    {...register("address")}
                    error={errors.address && errors.address?.message}
                />

                 <Select 
                  label="State"
                  required
                  options={stateOptions}
                  {...register("state")}
                  error={errors.state && errors.state?.message}
                />

                <Input 
                    label="LGA" 
                    required
                    type="text" 
                    placeholder="Enter LGA"
                    {...register("lga")}
                    error={errors.lga && errors.lga?.message}
                />

                <Input 
                    label="City" 
                    required
                    type="text" 
                    placeholder="Enter City"
                    {...register("city")}
                    error={errors.city && errors.city?.message}
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
                    maxLength={11}
                    inputMode="numeric"
                    placeholder="Enter Guarantor's Telephone Number"
                    {...register("phoneNumber")}
                    error={errors.phoneNumber && errors.phoneNumber?.message}
                />

                <Input 
                    label="Telephone Number 2"
                    type="tel" 
                    maxLength={11}
                    inputMode="numeric"
                    placeholder="Enter Guarantor's Telephone Number"
                    {...register("phoneNumberTwo")}
                    error={errors.phoneNumberTwo && errors.phoneNumberTwo?.message}
                />

            </div>

            <div className="w-full flex flex-col gap-5">
                <h2 className="text-[15px] text-center">
                  NEXT OF KIN DETAILS
                </h2>

                <Input 
                    label="First Name"
                    required 
                    type="text" 
                    placeholder="Enter First Name"
                    {...register("kinFirstName")}
                    error={errors.kinFirstName && errors.kinFirstName?.message}
                />

                <Input 
                    label="Last Name" 
                    required
                    type="text" 
                    placeholder="Enter Last Name"
                    {...register("kinLastName")}
                    error={errors.kinLastName && errors.kinLastName?.message}
                />

                <Input 
                    label="Middle Name" 
                    required
                    type="text" 
                    placeholder="Enter Middle Name"
                    {...register("kinMiddleName")}
                    error={errors.kinMiddleName && errors.kinMiddleName?.message}
                />

                <Select 
                  label="Gender"
                  required
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                  {...register("kinGender")}
                  error={errors.kinGender && errors.kinGender?.message}
                />

               <Input 
                    label="Address" 
                    required
                    type="text" 
                    placeholder="Enter Address"
                    {...register("kinAddress")}
                    error={errors.kinAddress && errors.kinAddress?.message}
                />
                <Select 
                  label="Relationship"
                  required
                  options= {relationships}
                  {...register("kinRelationship")}
                  error={errors.kinRelationship && errors.kinRelationship?.message}
                />

                  <Input 
                    label="Telephone Number"
                    required 
                    type="tel" 
                    maxLength={11}
                    inputMode="numeric"
                    placeholder="Enter Telephone Number"
                    {...register("kinPhoneNumber")}
                    error={errors.kinPhoneNumber && errors.kinPhoneNumber?.message}
                />

                <Input 
                    label="Telephone Number 2"
                    type="tel" 
                    maxLength={11}
                    inputMode="numeric"
                    placeholder="Enter Telephone Number 2"
                    {...register("kinPhoneNumberTwo")}
                    error={errors.kinPhoneNumberTwo && errors.kinPhoneNumberTwo?.message}
                />

            </div>

            <button className="bg-[rgb(0,176,240)] text-white py-3.25 w-full rounded-sm font-semibold cursor-pointer"
              type="submit"
            >
              Next
            </button>

          </form> 
          
      </div>
    </div>
  )
}

export default FormStepOne
