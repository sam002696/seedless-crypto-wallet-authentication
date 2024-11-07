import React from "react";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

const FetchTokenBalanceImport = ({
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenBalance,
  setTokenBalance,
  setErrorMessage,
  setIsNextButtonClicked,
  setOpen,
}) => {
  const renderImportTokenBackComponent = () => {
    setIsNextButtonClicked(false);
    setTokenBalance(null); // Reset balance on back
  };

  const saveImportTokenToStorage = () => {
    try {
      // Token details to save
      const tokenData = {
        tokenAddress,
        tokenSymbol,
        tokenDecimals,
        tokenBalance,
      };

      // Get existing TokenList from local storage or initialize an empty array
      const existingTokenList =
        JSON.parse(localStorage.getItem("TokenList")) || [];

      // Check if the token is already in the list by address to prevent duplicates
      const isTokenAlreadyAdded = existingTokenList.some(
        (token) => token.tokenAddress === tokenAddress
      );

      if (!isTokenAlreadyAdded) {
        // Add the new token data
        existingTokenList.push(tokenData);

        // Save the updated array back to local storage
        localStorage.setItem("TokenList", JSON.stringify(existingTokenList));

        // Optionally, reset the form or show a success message
        setErrorMessage(null); // Clear any previous errors
        alert("Token imported successfully!");
        setOpen(false);
      } else {
        alert("This token is already imported.");
      }
    } catch (error) {
      console.error("Error saving token to storage:", error);
      setErrorMessage("Failed to save token to storage.");
    }
  };

  return (
    <div>
      <label
        htmlFor="token_contract_address"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Would you like to import this token?
      </label>

      <div className="mt-5">
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon
                aria-hidden="true"
                className="h-5 w-5 text-blue-400"
              />
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">Symbol: {tokenSymbol}</p>
              <p className="text-sm text-blue-700">Balance: {tokenBalance}</p>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-between">
          <button
            onClick={renderImportTokenBackComponent}
            className="mt-3 w-1/3 text-white py-2 rounded-md bg-gray-300"
          >
            Back
          </button>
          <button
            onClick={saveImportTokenToStorage}
            className="mt-3 w-1/3 text-white py-2 rounded-md bg-blue-500"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default FetchTokenBalanceImport;
