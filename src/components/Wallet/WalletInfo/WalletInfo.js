import React from "react";

const WalletInfo = () => {
  return (
    <>
      <div className="flex flex-row justify-between items-center bg-white p-3 shadow-md">
        {/* Blockchain Network */}
        <div className=" bg-gray-100 px-3 py-2 rounded-2xl">
          <p className="font-medium text-sm">Ethereum Mainnet</p>
        </div>
        <div className="flex flex-col space-y-1">
          <p className=" font-medium text-sm ">Account 1</p>
          <div className="bg-gray-100 px-3 py-1.5 rounded-md">
            <p className=" font-normal text-sm">0xfc3....D78BD</p>
          </div>
        </div>
        <div>...</div>
      </div>
    </>
  );
};

export default WalletInfo;
