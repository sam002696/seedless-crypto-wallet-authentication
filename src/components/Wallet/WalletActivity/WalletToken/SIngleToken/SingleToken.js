import React, { useEffect, useState } from "react";
import SingleTokenInfo from "./SingleTokenInfo";
import SingleTokenActivity from "./SingleTokenActivity";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useTokenView } from "../../../../../context/TokenViewContext";
import { Token } from "../../../../../helpers/Token";

const SingleToken = () => {
  const { setIsTokenView, selectedToken } = useTokenView();

  console.log("selectedToken", selectedToken);

  const [token, setToken] = useState(null); // Local state to hold token

  useEffect(() => {
    if (selectedToken !== null) {
      // Save selected token to local storage
      Token.saveSelectedToken(selectedToken);
      setToken(selectedToken); // Update local state
    } else {
      // Fetch token from local storage if `selectedToken` is null
      const storedToken = Token.getsingleToken();
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, [selectedToken]);

  if (!token) {
    return (
      <div className="text-center p-4">
        <p>Loading token details...</p>
      </div>
    );
  }

  return (
    <>
      <div className="py-8 max-w-2xl mx-auto">
        {/* Back button, ARISPAY label, and three-dot menu */}
        <div className="flex justify-between items-center px-5 mb-4">
          {/* Back button and ARISPAY label */}
          <div className="flex items-center space-x-2">
            <ArrowLeftIcon
              onClick={() => setIsTokenView(false)}
              className="h-6 w-6 text-gray-700 cursor-pointer"
            />
            <span className="text-xl font-semibold text-gray-900">
              {token?.tokenSymbol}
            </span>
          </div>

          {/* Three-dot menu */}
          <div>
            <div class="test"></div>
          </div>
        </div>

        {/* Buy & Sell / Send buttons */}
        <div className="text-center">
          <div className="isolate inline-flex rounded-md shadow-sm pt-5">
            <button
              type="button"
              className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            >
              Buy & Sell
            </button>
            <button
              type="button"
              className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            >
              Send
            </button>
          </div>
        </div>

        {/* Token Info and Activity Components */}
        <div className="p-5">
          <SingleTokenInfo token={token} setToken={setToken} />
          <SingleTokenActivity token={token} setToken={setToken} />
        </div>
      </div>
    </>
  );
};

export default SingleToken;
