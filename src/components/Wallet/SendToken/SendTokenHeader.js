import React from "react";

const SendTokenHeader = ({ transactionData }) => {
  return (
    <>
      <div className="flex justify-between items-center p-3 border-b-2 border-gray-300">
        <div>Edit</div>
        <div>{transactionData.name}</div>
      </div>
    </>
  );
};

export default SendTokenHeader;
