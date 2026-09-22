"use client"

import Loader from "@/utils/Loader";
import ModalLayout from "@/utils/ModalLayout";
import { useState } from "react";
import Input from "@/components/shared/Input";
import {SignInSchema} from "@/utils/validation/signIn";
import type {SignInValues} from "@/utils/validation/signIn";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";


const SignIn = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      password: ""
    }
  });

   const onSubmit = async (data: SignInValues) => {
      setLoading(true)
      try {
        const response = await fetch("/api/admin/auth/sign-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Unable to sign in");
        router.push("/admin");
        router.refresh();
      } catch (error) {
        alert(error instanceof Error ? error.message : "Unable to sign in");
      } finally {
        setLoading(false);
      }
    }
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F8FB] px-3 py-6 sm:px-5 sm:py-10">
     {loading && (
        <ModalLayout setModal={setLoading} addclas="w-fit">
          <Loader title="processing" />
        </ModalLayout>
      )}
      <div className="w-full max-w-[674px] bg-white px-4 py-6 sm:px-6 sm:py-10 flex flex-col
                      items-center justify-center gap-[8px] rounded-[12px]"> 

          <Image 
              src="/fob-image.png"
              alt="fob-image"
              width={200}
              height={200}
            />

          <p className="text-center text-[#4B4B4B] px-[30px] mt-4" >
            Enter Admin credentials to access dashboard.
          </p>

          <form className="w-full pt-[30px] flex flex-col gap-[30px]"
            onSubmit={handleSubmit(onSubmit)}>

            <Input 
                    label="Email" 
                    type="email" 
                    placeholder="eg. Raheemjohn@gmail.com"
                    {...register("email")}
                    error={errors.email && errors.email?.message}
                    />


            <div className="flex flex-col">
                 <Input 
                    password
                    label="Password" 
                    type="password" 
                    placeholder="Enter your password"
                    {...register("password")}
                    error={errors.password && errors.password?.message}/>
                 <a href="/input-email"><p className="text-[#6B6B6B] text-end mt-[15px]">Forgot password</p></a>  
            </div>

            <button className="bg-[rgb(0,176,240)] text-white py-3.25 w-full rounded-sm font-semibold cursor-pointer"
              disabled={loading || isSubmitting}
              type="submit">
              Sign In
            </button>

          </form> 
      </div>
    </div>
  )
}

export default SignIn
