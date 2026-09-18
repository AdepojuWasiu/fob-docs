
"use client";

interface ConsentModalProps {
  onAccept: () => void;
  onReject: () => void;
}

const ConsentModal = ({
  onAccept,
  onReject,
}: ConsentModalProps) => {
  return (
    <div className="md:w-[45vw] w-[90vw] bg-white rounded-lg flex flex-col">
      <div className="w-full flex justify-center p-4 border-b border-gray-200">
        <h2 className="text-2xl">
          Consent for Personal Data Collection
        </h2>
      </div>

      <div className="flex flex-col gap-4 py-6 px-8">
        <div className="flex flex-col gap-4">
          <p className="text-gray-700 text-md">
            The Company recognizes the confidential nature of the Personal
            Data it collects and we are committed to ensuring the protection
            of every Personal and Sensitive Information we collect from you.
          </p>

          <p className="text-gray-700 text-md">
            By accepting, you acknowledge that you have reviewed the Privacy
            Policy and agree to its terms. This also means that you have
            consented to the use of Your Personal Data and has accepted the
            applicable disclosures.
          </p>
        </div>

        <div className="flex gap-6 px-8">
          <button
            type="button"
            onClick={onAccept}
            className="bg-[rgb(0,176,240)] text-white py-3.25 w-full rounded-sm font-semibold cursor-pointer"
          >
            I Accept
          </button>

          <button
            type="button"
            onClick={onReject}
            className="border border-gray-600 py-3.25 w-full rounded-sm font-semibold cursor-pointer"
          >
            I Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
