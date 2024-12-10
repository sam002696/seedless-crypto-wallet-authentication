import React, { useEffect, useRef } from "react";
import { appendJazziconToRef } from "../../../utilities/appendJazziconUtils";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";

const TransferInfo = ({ transactionData }) => {
  // Refs to hold Jazzicon elements
  const senderRef = useRef(null);
  const receiverRef = useRef(null);

  useEffect(() => {
    // utility function to generate Jazzicons - sami
    appendJazziconToRef(senderRef, transactionData.sender.address, 40);
    appendJazziconToRef(receiverRef, transactionData.receiver.address, 40);
  }, [transactionData]);

  return (
    <div>
      {/* Sender to receiver */}
      <div className="flex flex-row justify-between items-center p-3">
        <div className="flex items-center">
          {/* Sender Jazzicon */}
          <div
            ref={senderRef}
            className="w-10 h-10 rounded-full overflow-hidden"
          ></div>
          <span className="ml-3">{transactionData.sender.accountName}</span>
        </div>
        <div>
          <ArrowRightCircleIcon className="w-10 h-10 fill-blue-400" />
        </div>
        <div className="flex items-center">
          {/* Receiver Jazzicon */}
          <div
            ref={receiverRef}
            className="w-10 h-10 rounded-full overflow-hidden"
          ></div>
          <span className="ml-3">{transactionData.receiver.accountName}</span>
        </div>
      </div>

      {/* Transfer amount */}
      <div className="px-5 py-5 bg-gray-100">
        <div>
          <p>
            {transactionData?.transactionDetails?.tokenAddress?.slice(0, 10)}
            ...
            {transactionData?.transactionDetails?.tokenAddress?.slice(-8)}
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
  );
};

export default TransferInfo;
