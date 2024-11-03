import React from "react";
import SingleTokenInfo from "./SingleTokenInfo";
import SingleTokenActivity from "./SingleTokenActivity";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useTokenView } from "../../../../../context/TokenViewContext";

const SingleToken = () => {
  const { setIsTokenView } = useTokenView();
  return (
    <>
      <div className="py-4">
        {/* Back button, ARISPAY label, and three-dot menu */}
        <div className="flex justify-between items-center px-5 mb-4">
          {/* Back button and ARISPAY label */}
          <div className="flex items-center space-x-2">
            <ArrowLeftIcon
              onClick={() => setIsTokenView(false)}
              className="h-6 w-6 text-gray-700 cursor-pointer"
            />
            <span className="text-xl font-semibold text-gray-900">ARISPAY</span>
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
          <SingleTokenInfo />
          <SingleTokenActivity />
        </div>
      </div>
    </>
  );
};

export default SingleToken;
