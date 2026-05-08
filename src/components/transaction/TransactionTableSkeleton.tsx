export default function TransactionTableSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-200">
          <tr>
            {[
              "Sender",
              "Receiver",
              "Amount",
              "Time",
              "Tx Hash",
              "Action",
            ].map((item) => (
              <th
                key={item}
                className="p-4 text-left text-sm text-gray-600"
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {[1, 2, 3, 4, 5].map((row) => (
            <tr
              key={row}
              className="border-t animate-pulse"
            >

              <td className="p-4">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </td>

              <td className="p-4">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </td>

              <td className="p-4">
                <div className="h-4 w-16 bg-green-100 rounded"></div>
              </td>

              <td className="p-4">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </td>

              <td className="p-4">
                <div className="h-4 w-40 bg-blue-100 rounded"></div>
              </td>

              <td className="p-4">
                <div className="h-8 w-16 bg-indigo-100 rounded-lg"></div>
              </td>

            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}