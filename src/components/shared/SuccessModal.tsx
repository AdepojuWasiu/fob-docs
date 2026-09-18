"use client";


interface SuccessModalProps { onClose: () => void; title: string; }

export default function SuccessModal({ onClose, title }: SuccessModalProps) {
  return (
      <div className="w-[calc(100vw-2rem)] max-w-[520px] bg-white rounded-lg flex flex-col justify-center items-center px-5 py-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
            ✓
        </div>
        <h2 className="text-center text-xl font-semibold sm:text-2xl">
            {title}
        </h2>
        <p className="mt-3 text-gray-600 text-center">
            Your form was submitted successfully. Thank you for your time.
        </p>
        <button 
          type="button" onClick={onClose} 
          className="mt-6 w-full rounded-sm bg-[rgb(0,176,240)] py-3 font-semibold text-white cursor-pointer">
            Close
        </button>
      </div>
  );
}
