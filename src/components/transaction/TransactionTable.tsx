type Transaction = {
  sender: string;
  receiver: string;
  amount: string;
  txHash: string;
  time: string;
};

export default function TransactionTable({
  txHistory,
  setSelectedTx,
  setShowDetailsModal,
}: {
  txHistory: Transaction[];
  setSelectedTx: (tx: Transaction) => void;
  setShowDetailsModal: (val: boolean) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-4">Sender</th>
            <th className="p-4">Receiver</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Time</th>
            <th className="p-4">Tx Hash</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {txHistory.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-500">
                No transactions yet
              </td>
            </tr>
          ) : (
            txHistory.map((tx, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-4 truncate max-w-[120px]">{tx.sender}</td>
                <td className="p-4 truncate max-w-[120px]">{tx.receiver}</td>
                <td className="p-4 font-medium text-green-600">
                  {tx.amount} ADA
                </td>
                <td className="p-4 text-gray-500">{tx.time}</td>
                <td className="p-4 truncate max-w-[150px] text-blue-600">
                  {tx.txHash}
                </td>

                <td className="p-4">
                  <button
                    onClick={() => {
                      setSelectedTx(tx);
                      setShowDetailsModal(true);
                    }}
                    className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}