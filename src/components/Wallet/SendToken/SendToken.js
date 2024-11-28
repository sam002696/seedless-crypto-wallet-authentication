import React from "react";
import SendTokenHeader from "./SendTokenHeader";
import TransferInfo from "./TransferInfo";
import DisplayTransaction from "./DisplayTransaction";

const SendToken = () => {
  const transactionData = JSON.parse(localStorage.getItem("dataToSend"));

  return (
    <>
      <div className="">
        {/* Header */}
        <SendTokenHeader transactionData={transactionData.network} />
        {/* Transfer Info */}
        <TransferInfo transactionData={transactionData} />

        {/* Display Details, Hex */}
        <DisplayTransaction transactionData={transactionData} />
      </div>
    </>
  );
};

export default SendToken;
