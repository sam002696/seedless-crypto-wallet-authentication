import React, { useState } from "react";
import ImportTokenModal from "../../../Modal/ImportTokenModal/ImportTokenModal";
import TokenList from "./TokenList";

const WalletToken = () => {
  const [open, setOpen] = useState(false);

  const handleImportToken = () => {
    console.log("Clicked");
    setOpen(true);
  };

  return (
    <>
      {/* Buy ETH */}
      <div className="bg-blue-600 p-2 rounded-md">
        <h3 className="text-xl font-semibold leading-6 text-white">
          Fund your wallet
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-white">
          Get started by adding some ETH to your wallet.
        </p>
        <button
          type="button"
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-white-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white mt-5"
        >
          Buy ETH
        </button>
      </div>

      <TokenList />

      <div className=" flex flex-col space-y-3 mt-3">
        <button
          onClick={() => handleImportToken()}
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

      <ImportTokenModal setOpen={setOpen} open={open} />
    </>
  );
};

export default WalletToken;
