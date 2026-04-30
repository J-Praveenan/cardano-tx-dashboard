import { useLovelace, useWallet } from "@meshsdk/react";
import { useEffect, useState } from "react";

export default function BalanceWithUsd() {
  const lovelace = useLovelace();

  const [adaPrice, setAdaPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const {connected} = useWallet();

  
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd"
        );
        const data = await res.json();

        setAdaPrice(data.cardano.usd);
      } catch (err) {
        console.error("Price fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, []);

  
  if (!lovelace || loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">Loading balance...</p>
      </div>
    );
  }

  
  const ada = parseInt(lovelace) / 1_000_000;
  const usd = adaPrice ? ada * adaPrice : null;

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-gray-500 mb-2">Balance</h2>

      {
        connected && 
        <p className="text-3xl font-bold text-gray-800">
        {ada.toFixed(2)} ADA
      </p>
      }
      
      
      {error ? (
        <p className="text-red-400 text-sm mt-1">
          Failed to fetch price
        </p>
      ) : usd !== null ? (
        connected && 
        <p className="text-gray-500 mt-1">
          ≈ ${usd.toFixed(2)} USD
        </p>
      ) : (
        <p className="text-gray-400 text-sm mt-1">
          Fetching price...
        </p>
      )}

    </div>
  );
}