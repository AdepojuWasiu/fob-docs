import { useEffect } from "react";
import { gsap } from "gsap";
import Image from "next/image";

interface LoadingProps {
  title?: string;
}

const Loader = ({ title }: LoadingProps) => {
  useEffect(() => {
    gsap.to(".loader-ring", {
      rotation: 360,
      duration: 1.2,
      repeat: -1,
      ease: "linear",
      transformOrigin: "center",
    });
  }, []);

  return (
    <div className="w-full h-full absolute top-0 left-0 z-50 flex flex-col gap-3 items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Rotating ring */}
        <div className="loader-ring absolute inset-0 border-4 border-gray-300 border-t-blue-700 rounded-full"></div>

        <Image 
          src="/white-logo.png"
          alt="fob-image"
          width={40}
          height={40}
        />
      </div>

      {title && <div className="text-white text-sm mt-2">...{title}</div>}
    </div>
  );
};

export default Loader;
