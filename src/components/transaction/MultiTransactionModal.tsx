export default function MultiTransactionModal({
  showMultiModal,
  setShowMultiModal,
  multiTxs,
  setMultiTxs,
  sendMultipleAda,
  loading,
}: any) {
  if (!showMultiModal) return null;

  const addRow = () => {
    setMultiTxs([
      ...multiTxs,
      { receiver: "", amount: "" },
    ]);
  };

  const removeRow = (index: number) => {
    const updated = [...multiTxs];
    updated.splice(index, 1);

    setMultiTxs(updated);
  };

  const updateField = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...multiTxs];

    updated[index][field] = value;

    setMultiTxs(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-50">

      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Multiple Transactions
          </h2>

          <button
            onClick={() => setShowMultiModal(false)}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">

          {multiTxs.map((tx: any, index: number) => (
            <div
              key={index}
              className="border rounded-xl p-4 bg-gray-50"
            >

              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-700">
                  Recipient #{index + 1}
                </h3>

                {multiTxs.length > 1 && (
                  <button
                    onClick={() => removeRow(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="flex gap-3">

                <input
                    type="text"
                    placeholder="Receiver Address"
                    value={tx.receiver}
                    onChange={(e) =>
                    updateField(
                        index,
                        "receiver",
                        e.target.value
                    )
                    }
                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />

                <input
                    type="number"
                    placeholder="Amount (ADA)"
                    value={tx.amount}
                    onChange={(e) =>
                    updateField(
                        index,
                        "amount",
                        e.target.value
                    )
                    }
                    className="w-40 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />

                </div>
            </div>
          ))}

        </div>

        <button
          onClick={addRow}
          className="mt-5 w-full border-2 border-dashed border-purple-400 text-purple-600 py-3 rounded-xl hover:bg-purple-50"
        >
          + Add Another Recipient
        </button>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={() => setShowMultiModal(false)}
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>

          <button
            onClick={sendMultipleAda}
            disabled={loading}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            {loading
              ? "Sending..."
              : "Send Multiple ADA"}
          </button>

        </div>

      </div>
    </div>
  );
}