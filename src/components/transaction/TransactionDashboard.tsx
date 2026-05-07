import { useState, useEffect } from "react";
import TransactionTable from "./TransactionTable";
import CreateTransactionModal from "./CreateTransactionModal";
import TransactionDetailsModal from "./TransactionDetailsModal";
import MultiTransactionModal from "./MultiTransactionModal";
import { useWallet } from "@meshsdk/react";
import { MeshTxBuilder, BlockfrostProvider } from "@meshsdk/core";

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

  const [showMultiModal, setShowMultiModal] = useState(false);

  const [multiTxs, setMultiTxs] = useState([
    { receiver: "", amount: "" },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("txHistory");
    if (saved) setTxHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("txHistory", JSON.stringify(txHistory));
  }, [txHistory]);

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
        .txOut(receiver, [
          { unit: "lovelace", quantity: lovelaceAmount },
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

  const sendMultipleAda = async () => {
    try {
      if (!connected) {
        return alert("Connect wallet first");
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

      // Add multiple outputs
      multiTxs.forEach((tx) => {
        if (tx.receiver && tx.amount) {
          txBuilder.txOut(tx.receiver, [
            {
              unit: "lovelace",
              quantity: (
                parseFloat(tx.amount) * 1_000_000
              ).toString(),
            },
          ]);
        }
      });

      const unsignedTx = await txBuilder
        .changeAddress(changeAddress)
        .selectUtxosFrom(utxos)
        .complete();

      const signedTx = await wallet.signTx(unsignedTx);

      const txHash = await wallet.submitTx(signedTx);

      // Save locally
      const now = new Date().toLocaleString();

      const newHistory = multiTxs.map((tx) => ({
        sender: changeAddress,
        receiver: tx.receiver,
        amount: tx.amount,
        txHash,
        time: now,
      }));

      setTxHistory((prev) => [...newHistory, ...prev]);

      setShowMultiModal(false);

      setMultiTxs([{ receiver: "", amount: "" }]);

    } catch (err) {
      console.error(err);
      alert("Multi transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transactions</h2>

        <div className="flex gap-3">

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Single Transaction
          </button>

          <button
            onClick={() => setShowMultiModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            + Multiple Transaction
          </button>

        </div>
      </div>

      <TransactionTable
        txHistory={txHistory}
        setSelectedTx={setSelectedTx}
        setShowDetailsModal={setShowDetailsModal}
      />

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

      <MultiTransactionModal
        showMultiModal={showMultiModal}
        setShowMultiModal={setShowMultiModal}
        multiTxs={multiTxs}
        setMultiTxs={setMultiTxs}
        sendMultipleAda={sendMultipleAda}
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