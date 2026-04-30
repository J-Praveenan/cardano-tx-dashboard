import Head from "next/head";
import { CardanoWallet, MeshBadge } from "@meshsdk/react";
import WalletHeader from "@/components/wallet/WalletHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <WalletHeader/>
    </div>
  );
}
