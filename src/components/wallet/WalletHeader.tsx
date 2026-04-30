import { useWallet, useNetwork, CardanoWallet } from "@meshsdk/react";

export default function WalletHeader() {
  const { name, disconnect, connected } = useWallet();
  const network = useNetwork();

  return (
    <div className="bg-white shadow-md rounded-xl px-6 py-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">

      
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          🚀 Cardano Transaction Dashboard
        </h1>

        {connected && (
          <p className="text-gray-500 text-sm mt-1">
            Connected Wallet: <span className="font-medium">{name}</span>
          </p>
        )}
      </div>

      
      <div className="flex items-center gap-3">

        
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            network === 1
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {network === 1 ? "Mainnet" : network === 0 ? "Testnet" : "Network"}
        </span>

        
        <CardanoWallet isDark={true} />

        
        {connected && (
          <button
            onClick={disconnect}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
}