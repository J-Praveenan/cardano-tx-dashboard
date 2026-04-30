import Head from "next/head";
import { CardanoWallet, MeshBadge } from "@meshsdk/react";
import WalletHeader from "@/components/wallet/WalletHeader";
import BalanceWithUsd from "@/components/wallet/BalanceWithUsd";
import AddressCard from "@/components/wallet/AddressCard";
import WalletInfo from "@/components/wallet/WalletInfo";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <WalletHeader/>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <BalanceWithUsd/>
        <AddressCard/>
        <WalletInfo/>
      </div>
    </div>
  );
}
