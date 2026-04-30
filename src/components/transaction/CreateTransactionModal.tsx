export default function CreateTransactionModal({
  showModal,
  setShowModal,
  receiver,
  setReceiver,
  amount,
  setAmount,
  sendAda,
  loading,
}: any) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

        <h2 className="text-xl font-bold mb-5 text-gray-800">
          Create Transaction
        </h2>

        <input
          type="text"
          placeholder="Receiver Address"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="number"
          placeholder="Amount (ADA)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 mb-5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>

          <button
            onClick={sendAda}
            disabled={loading}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {loading ? "Sending..." : "Send ADA"}
          </button>
        </div>
      </div>
    </div>
  );
}