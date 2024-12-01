import React, { useState, useEffect } from "react";
import Web3 from "web3";

const TransactionHex = ({ transactionData }) => {
  const [hexData, setHexData] = useState("");

  useEffect(() => {
    if (
      transactionData.receiver.address &&
      transactionData.transactionDetails.amount >= 0
    ) {
      generateHexData();
    }
  }, [transactionData]);

  const generateHexData = () => {
    try {
      // Initialize web3
      const web3 = new Web3();

      // Define the ABI for the "transfer(address,uint256)" function
      const functionAbi = {
        name: "transfer",
        type: "function",
        inputs: [
          { type: "address", name: "to" },
          { type: "uint256", name: "value" },
        ],
      };

      // Encode the function call
      const encodedData = web3.eth.abi.encodeFunctionCall(functionAbi, [
        transactionData.receiver.address, // Receiver address
        web3.utils.toWei(
          transactionData.transactionDetails.amount.toString(),
          "ether"
        ), // Amount in Wei
      ]);

      setHexData(encodedData);
    } catch (error) {
      console.error("Error generating hex data:", error);
    }
  };

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
    "type": "address",
    "value": "${transactionData.receiver.address}"
  },
  {
    "type": "uint256",
    "value": "${transactionData.transactionDetails.amount}"
  }
]`}
        </pre>
      </div>

      {/* Hex Data */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700">
          HEX DATA: {hexData.length / 2} BYTES
        </h4>
        <div className="mt-2 bg-gray-100 text-sm text-gray-800 p-3 rounded-md overflow-auto">
          {hexData || "Generating hex data..."}
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
