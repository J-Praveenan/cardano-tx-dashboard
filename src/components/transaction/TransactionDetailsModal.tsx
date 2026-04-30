type Transaction = {
  sender: string;
  receiver: string;
  amount: string;
  txHash: string;
  time: string;
};

export default function TransactionDetailsModal({
  showDetailsModal,
  setShowDetailsModal,
  selectedTx,
}: {
  showDetailsModal: boolean;
  setShowDetailsModal: (val: boolean) => void;
  selectedTx: Transaction | null;
}) {
  if (!showDetailsModal || !selectedTx) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">

        <h2 className="text-xl font-bold mb-5 text-gray-800">
          Transaction Details
        </h2>

        <div className="space-y-3 text-sm">

          <div>
            <span className="font-semibold">Sender:</span>
            <p className="break-all">{selectedTx.sender}</p>
          </div>

          <div>
            <span className="font-semibold">Receiver:</span>
            <p className="break-all">{selectedTx.receiver}</p>
          </div>

          <div>
            <span className="font-semibold">Amount:</span>
            <p>{selectedTx.amount} ADA</p>
          </div>

          <div>
            <span className="font-semibold">Time:</span>
            <p>{selectedTx.time}</p>
          </div>

          <div>
            <span className="font-semibold">Tx Hash:</span>
            <p className="break-all text-blue-600">
              {selectedTx.txHash}
            </p>
          </div>

        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => setShowDetailsModal(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}