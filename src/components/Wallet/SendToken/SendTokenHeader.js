import React from "react";

const SendTokenHeader = ({ transactionData }) => {
  return (
    <>
      <div className="flex justify-between items-center p-3 border-b-2 border-gray-300">
        <div>
          <p className="text-blue-500 font-semibold">Edit</p>{" "}
        </div>
        <div className="border-gray-300 p-2 rounded-lg bg-gray-200">
          <p className="">{transactionData.name}</p>
        </div>
      </div>
    </>
  );
};

export default SendTokenHeader;
