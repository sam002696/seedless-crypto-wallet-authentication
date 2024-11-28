import React from "react";

const TransferInfo = ({ transactionData }) => {
  return (
    <>
      <div>
        {/* Sender to receiver */}
        <div className=" flex flex-row justify-between p-3">
          <div>{transactionData.sender.accountName}</div>
          <div>---</div>
          <div>{transactionData.receiver.accountName}</div>
        </div>
        {/* Transfer amount */}
        <div className="px-5 py-5 bg-gray-100">
          <div>
            <p>
              {transactionData?.transactionDetails?.tokenAddress.slice(0, 10)}
              ...$
              {transactionData?.transactionDetails?.tokenAddress.slice(-8)}
            </p>
          </div>
          <div className="mt-3">
            <p className="text-bold text-5xl">
              {transactionData.transactionDetails.amount}{" "}
              {transactionData.transactionDetails.tokenName}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransferInfo;
