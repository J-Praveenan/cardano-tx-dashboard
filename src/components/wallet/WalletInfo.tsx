import { useWallet, useAssets } from "@meshsdk/react";

export default function WalletInfo() {
  const { name } = useWallet();
  const assets = useAssets();

  const totalAssets = assets?.length || 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-between">
      
      <h2 className="text-gray-500 mb-2">Wallet Info</h2>
      <div className="space-y-2 text-gray-800">

        <p>
          <span className="font-medium">Wallet Name:</span>{" "}
          {name || "Not connected"}
        </p>

        <p>
          <span className="font-medium">Total Assets:</span>{" "}
          {totalAssets}
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Wallet data is fetched from connected provider
      </div>

    </div>
  );
}