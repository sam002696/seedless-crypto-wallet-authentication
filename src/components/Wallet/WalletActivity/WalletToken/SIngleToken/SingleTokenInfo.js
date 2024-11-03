import React from "react";

const SingleTokenInfo = () => {
  return (
    <>
      <div className="">
        <p className="text-xl font-bold">Your Balance</p>
        <div className="flex justify-between items-center bg-gray-100 rounded-lg p-4 mb-2 shadow-md mt-5">
          <span className="text-lg font-semibold">ARISPAY</span>
          <span className="text-gray-700">140 ARISPAY</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xl font-bold">Token details</p>
        <div className="flex justify-between items-start bg-gray-100 rounded-lg p-4 mb-2 shadow-md mt-5">
          {/* First Column for Contract Address */}
          <div className="flex flex-col mr-4">
            <span className="text-lg font-semibold">Contract Address</span>
            <span className="text-gray-700">0*8ecgschgsh..712727</span>
          </div>

          {/* Second Column for Contract Address */}
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Token decimal</span>
            <span className="text-gray-700">18</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleTokenInfo;
