import { useAddress } from "@meshsdk/react";
import { useState } from "react";

export default function AddressCard() {
  const address = useAddress();
  const [copied, setCopied] = useState(false);

  const shortAddress = address
    ? `${address.slice(0, 12)}...${address.slice(-6)}`
    : "No address";

  const handleCopy = async () => {
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-between">

      <h2 className="text-gray-500 mb-2">Wallet Address</h2>

      <p className="font-mono text-gray-800 break-all">
        {shortAddress}
      </p>

      <div className="flex items-center justify-between mt-4">

        <button
          onClick={handleCopy}
          className={`px-3 py-1 text-sm rounded-lg transition ${
            copied
              ? "bg-green-100 text-green-600"
              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
          }`}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>

        
        {address && (
          <span className="text-xs text-gray-400">
            Full address hidden
          </span>
        )}
      </div>
    </div>
  );
}