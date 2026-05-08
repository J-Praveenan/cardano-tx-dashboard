import { useState, useEffect } from "react";
import TransactionTable from "./TransactionTable";
import CreateTransactionModal from "./CreateTransactionModal";
import TransactionDetailsModal from "./TransactionDetailsModal";
import { useWallet } from "@meshsdk/react";
import { MeshTxBuilder, BlockfrostProvider } from "@meshsdk/core";
import TransactionTableSkeleton from "./TransactionTableSkeleton";

type Transaction = {
  sender: string;
  receiver: string;
  amount: string;
  txHash: string;
  time: string;
};

export default function TransactionDashboard() {
  const { wallet, connected } = useWallet();

  const [txHistory, setTxHistory] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTxs, setLoadingTxs] = useState(true);

  const [multiTxs, setMultiTxs] = useState([
    { receiver: "", amount: "" },
  ]);


  const shortAddress = (address: string) => {
    return `${address.slice(0, 12)}...${address.slice(-8)}`;
  };

  const fetchTransactions = async () => {
    try {

      if (!connected || !wallet) return;

      setLoadingTxs(true);

      const provider = new BlockfrostProvider(
        process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY!
      );

      const address =
        await wallet.getChangeAddress();

      // Fetch transactions
      const txs =
        await provider.fetchAddressTransactions(
          address
        );

      // Latest 10 only
      const latestTxs =
        txs.slice(0, 10);

      // Fetch metadata
      const results = await Promise.all(

        latestTxs.map(async (tx: any) => {

          try {

            const response = await fetch(
              `https://cardano-preprod.blockfrost.io/api/v0/txs/${tx.hash}/metadata`,
              {
                headers: {
                  project_id:
                    process.env
                      .NEXT_PUBLIC_BLOCKFROST_API_KEY!,
                },
              }
            );

            const metadata =
              await response.json();

            // Find metadata label
            const appMetadata =
              metadata.find(
                (m: any) =>
                  Number(m.label) === 674
              );

            if (!appMetadata)
              return null;

            const json =
              appMetadata.json_metadata;

            return {

              sender: shortAddress(json.sender),
              receiver: shortAddress(json.receiver),
              amount: `${json.amount} ADA`,
              txHash:
                tx.hash,

              time: new Date(
                json.createdAt
              ).toLocaleString(),
            };

          } catch {

            return null;
          }
        })
      );

      const filtered =
        results.filter(Boolean);

      setTxHistory(filtered as Transaction[]);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingTxs(false);
    }
  };

  const sendAda = async () => {
    try {
      if (!connected) return alert("Connect wallet first");

      if (!receiver || !amount) {
        return alert("Fill all fields");
      }

      setLoading(true);

      const provider = new BlockfrostProvider(
        process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY!
      );

      const txBuilder = new MeshTxBuilder({
        fetcher: provider,
        verbose: true,
      });

      const changeAddress = await wallet.getChangeAddress();
      const utxos = await wallet.getUtxos();

      const lovelaceAmount = (parseFloat(amount) * 1_000_000).toString();

      const unsignedTx = await txBuilder

        // Store metadata on blockchain
        .metadataValue(674, {
          app: "Cardano Transaction Dashboard",
          sender: `${changeAddress.slice(0, 12)}...${changeAddress.slice(-8)}`,
          receiver: `${receiver.slice(0, 12)}...${receiver.slice(-8)}`,
          amount: amount,
          createdAt: new Date().toISOString(),
        })

        .txOut(receiver, [
          {
            unit: "lovelace",
            quantity: lovelaceAmount,
          },
        ])

        .changeAddress(changeAddress)
        .selectUtxosFrom(utxos)
        .complete();

      const signedTx = await wallet.signTx(unsignedTx);

      const txHash = await wallet.submitTx(signedTx);

      const newTx: Transaction = {
        sender: changeAddress,
        receiver,
        amount,
        txHash,
        time: new Date().toLocaleString(),
      };

      setTxHistory((prev) => [newTx, ...prev]);

      setShowModal(false);
      setReceiver("");
      setAmount("");

    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (connected) {
      fetchTransactions();
    }
  },[connected]);

  return (
    <div className="mt-10">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transactions</h2>

        <div className="flex gap-3">

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Create Transaction
          </button>

        </div>
      </div>

      {loadingTxs ? (

  <TransactionTableSkeleton />

) : (

  <TransactionTable
    txHistory={txHistory}
    setSelectedTx={setSelectedTx}
    setShowDetailsModal={setShowDetailsModal}
  />

)}

      <CreateTransactionModal
        showModal={showModal}
        setShowModal={setShowModal}
        receiver={receiver}
        setReceiver={setReceiver}
        amount={amount}
        setAmount={setAmount}
        sendAda={sendAda}
        loading={loading}
      />

      <TransactionDetailsModal
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        selectedTx={selectedTx}
      />
    </div>
  );
}