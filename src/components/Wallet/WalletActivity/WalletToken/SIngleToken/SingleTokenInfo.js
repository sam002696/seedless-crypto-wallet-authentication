import React, { useState } from "react";
import {
  DocumentDuplicateIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

const SingleTokenInfo = ({ token, setToken }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [tooltipText, setTooltipText] = useState("Copy to Clipboard");
  const tokenAddress = token?.tokenAddress || "0x000000"; // Default fallback

  // Truncate address (first 7 and last 5 characters)
  const truncatedTokenAddress = `${tokenAddress.slice(
    0,
    7
  )}...${tokenAddress.slice(-8)}`;

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Use the clipboard API if available
      navigator.clipboard
        .writeText(tokenAddress)
        .then(() => {
          setIsCopied(true);
          setTooltipText("Address Copied!");
          setTimeout(() => {
            setIsCopied(false);
            setTooltipText("Copy to Clipboard");
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    } else {
      // Fallback: create a temporary textarea for copying
      const tempTextArea = document.createElement("textarea");
      tempTextArea.value = tokenAddress;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      try {
        document.execCommand("copy");
        setIsCopied(true);
        setTooltipText("Address Copied!");
      } catch (err) {
        console.error("Fallback copy failed: ", err);
      }
      document.body.removeChild(tempTextArea);
      setTimeout(() => {
        setIsCopied(false);
        setTooltipText("Copy to Clipboard");
      }, 2000);
    }
  };
  console.log("token", token);
  return (
    <>
      <div className="">
        <p className="text-xl font-bold">Your Balance</p>
        <div className="flex justify-between items-center bg-gray-100 rounded-lg p-4 mb-2 shadow-md mt-5">
          <span className="text-lg font-semibold">{token?.tokenSymbol}</span>
          <span className="text-gray-700">
            {token?.balance} {token?.tokenSymbol}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xl font-bold">Token details</p>
        <div className="flex justify-between items-start bg-gray-100 rounded-lg p-4 mb-2 shadow-md mt-5">
          {/* First Column for Contract Address */}
          <div className="flex flex-col mr-4">
            <span className="text-md font-semibold p-1">Contract Address</span>
            <span className="text-md font-semibold p-1">Token decimal</span>
          </div>

          {/* Second Column for Contract Address */}
          <div className="flex flex-col">
            <div
              className="rounded-md bg-blue-100 p-2 cursor-pointer hover:bg-blue-200 transition-colors duration-200 max-w-sm mx-auto"
              onClick={handleCopy}
              title={tooltipText} // Tooltip to show on hover
            >
              <div className="flex items-center">
                <div className="ml-2 flex-1 md:flex md:justify-between items-center">
                  <p className="text-sm text-blue-700 tracking-widest">
                    {truncatedTokenAddress}
                  </p>
                  <div className="mt-3 text-sm md:ml-2 md:mt-0">
                    {isCopied ? (
                      <CheckCircleIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-blue-500"
                      />
                    ) : (
                      <DocumentDuplicateIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-blue-400"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <span className="text-gray-700 text-end mr-3">
              {token?.tokenDecimals}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleTokenInfo;
