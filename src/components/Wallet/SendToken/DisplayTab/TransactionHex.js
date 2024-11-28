import React from "react";

const TransactionHex = () => {
  const hexData =
    "0xa9059cbb000000000000000000000000fa5a1235fcfc91cf336cb9adc8dbb2fa80e7c24400000000000000000000000000000000000000000000000000000007ce66c50e2840000";

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h3 className="text-sm font-semibold text-gray-700">FUNCTION TYPE:</h3>
        <p className="text-sm font-medium text-gray-900">
          Transfer (Address, Uint256)
        </p>
      </div>

      {/* Parameters */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700">PARAMETERS:</h4>
        <pre className="mt-2 bg-gray-100 text-sm text-gray-800 p-3 rounded-md overflow-auto">
          {`[
  {
    "type": "address"
  },
  {
    "type": "uint256"
  }
]`}
        </pre>
      </div>

      {/* Hex Data */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700">
          HEX DATA: 68 BYTES
        </h4>
        <div className="mt-2 bg-gray-100 text-sm text-gray-800 p-3 rounded-md overflow-auto">
          {hexData}
        </div>
      </div>

      {/* Copy Button */}
      <button
        onClick={() => navigator.clipboard.writeText(hexData)}
        className="mt-4 text-blue-600 text-sm flex items-center hover:underline"
      >
        Copy raw transaction data
      </button>
    </div>
  );
};

export default TransactionHex;
