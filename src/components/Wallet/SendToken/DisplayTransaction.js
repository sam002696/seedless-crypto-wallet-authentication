import React, { useState } from "react";
import TransactionDetails from "./DisplayTab/TransactionDetails";
import TransactionHex from "./DisplayTab/TransactionHex";
import { useHistory } from "react-router-dom";

const DisplayTransaction = ({ transactionData }) => {
  const history = useHistory();
  const walletTransactionInfo = ["Details", "HEX"];
  const [walletTransaction, setWalletTransaction] = useState("Details");

  const displayTabContent = () => {
    switch (walletTransaction) {
      case "Details":
        return <TransactionDetails transactionData={transactionData} />;
      case "HEX":
        return <TransactionHex transactionData={transactionData} />;

      // eslint-disable-next-line no-fallthrough
      default:
        return null;
    }
  };

  const handleRejectTransaction = () => {
    history.push("/wallet");
    localStorage.removeItem("selectedGasFeeType");
  };

  return (
    <div className="flex flex-col min-h-screen ">
      {/* Tabs Display Start */}
      <div className="flex flex-row justify-between mt-5">
        {walletTransactionInfo.map((item) => (
          <button
            key={item}
            className={`flex-1 py-3 text-center font-bold text-base cursor-pointer ${
              walletTransaction === item
                ? "border-b-4 border-blue-500 text-blue-500"
                : "border-b-4 border-gray-300 text-gray-400"
            }`}
            onClick={() => setWalletTransaction(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="mt-4 px-3">{displayTabContent()}</div>

      <div className="flex justify-between items-center mt-6 px-4">
        <button
          onClick={handleRejectTransaction}
          className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300"
        >
          Reject
        </button>
        <button
          disabled={transactionData?.transactionDetails?.amount === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default DisplayTransaction;
