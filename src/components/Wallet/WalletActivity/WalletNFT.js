import React, { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import ImportNFTTokenModal from "../../Modal/ImportNFTTokenModal/ImportNFTTokenModal";

const WalletNFT = () => {
  const [open, setOpen] = useState(false);

  const handleImportNFTToken = () => {
    console.log("Clicked");
    setOpen(true);
  };

  return (
    <>
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              aria-hidden="true"
              className="h-5 w-5 text-yellow-400"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              NFT autodetection
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Let MetaMask automatically detect and display NFTs in your
                wallet. <br /> Enable NFT autodetection
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className=" flex flex-col space-y-3 mt-3">
        <button
          onClick={() => handleImportNFTToken()}
          type="button"
          className="text-blue-500 font-semibold"
        >
          + Import tokens
        </button>
        <button type="button" className="text-blue-500 font-semibold">
          Refresh list
        </button>
      </div>

      {/* Import Wallet */}

      <ImportNFTTokenModal setOpen={setOpen} open={open} />
    </>
  );
};

export default WalletNFT;
