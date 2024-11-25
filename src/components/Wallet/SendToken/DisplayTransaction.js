import React, { useState } from "react";
import TransactionDetails from "./DisplayTab/TransactionDetails";
import TransactionHex from "./DisplayTab/TransactionHex";

const DisplayTransaction = () => {
  const walletTransactionInfo = ["Details", "HEX"];
  const [walletTransaction, setWalletTransaction] = useState("Details");

  const displayTabContent = () => {
    switch (walletTransaction) {
      case "Details":
        return <TransactionDetails />;
      case "HEX":
        return <TransactionHex />;

      // eslint-disable-next-line no-fallthrough
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen ">
      {/* Tabs Display Start */}
      <div className="flex flex-row justify-between mt-5">
        {walletTransactionInfo.map((item) => (
          <button
            key={item}
            className={`flex-1 py-3 text-center font-bold text-base ${
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
    </div>
  );
};

export default DisplayTransaction;
