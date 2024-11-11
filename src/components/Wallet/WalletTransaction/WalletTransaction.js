import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectNetwork } from "../../../reducers/networkSlice";
import SendCryptoTokenModal from "../../Modal/SendCryptoTokenModal/SendCryptoTokenModal";

const WalletTransaction = () => {
  const selectedNetworkInfo = useSelector(selectNetwork);

  const [openCryptoTokenSend, setOpenCryptoTokenSend] = useState(false);

  const handleCryptoTokenSend = () => {
    setOpenCryptoTokenSend(true);
  };

  return (
    <>
      <div className="py-4 text-center">
        <div className="flex flex-col space-y-2 ">
          <p className="text-2xl font-medium">
            {selectedNetworkInfo?.balance} {selectedNetworkInfo?.ticker}
          </p>
          <p>$0.00 USD Portfolio</p>
          <p>+$0.00 (+0.00%)</p>
        </div>

        <div className="isolate inline-flex rounded-md shadow-sm pt-5">
          <button
            type="button"
            className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            Buy & Sell
          </button>
          <button
            type="button"
            className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            Swap
          </button>
          <button
            type="button"
            className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            Bridge
          </button>
          <button
            type="button"
            onClick={() => handleCryptoTokenSend()}
            className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            Send
          </button>
          <button
            type="button"
            className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            Receive
          </button>
        </div>
      </div>
      {/* Import Wallet */}

      <SendCryptoTokenModal
        setOpenCryptoTokenSend={setOpenCryptoTokenSend}
        openCryptoTokenSend={openCryptoTokenSend}
      />
    </>
  );
};

export default WalletTransaction;
