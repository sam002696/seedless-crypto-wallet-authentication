import React from "react";
import SendTokenHeader from "./SendTokenHeader";
import TransferInfo from "./TransferInfo";
import DisplayTransaction from "./DisplayTransaction";

const SendToken = () => {
  return (
    <>
      <div className="">
        {/* Header */}
        <SendTokenHeader />
        {/* Transfer Info */}
        <TransferInfo />

        {/* Display Details, Hex */}
        <DisplayTransaction />
      </div>
    </>
  );
};

export default SendToken;
