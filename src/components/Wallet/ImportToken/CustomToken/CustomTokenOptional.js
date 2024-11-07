/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { AuthUser } from "../../../../helpers/AuthUser";

const CustomToken = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState(null);
  const [tokenDecimals, setTokenDecimals] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null); // New state for token balance
  const [errorMessage, setErrorMessage] = useState(null);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isNextButtonClicked, setIsNextButtonClicked] = useState(false);

  console.log("tokenDecimals", tokenDecimals);
  console.log("tokenBalance", tokenBalance);

  const publicAddress = AuthUser.getPublicKey();
  console.log("publicAddress", publicAddress);

  const handleAddressChange = (e) => {
    setTokenAddress(e.target.value);
    setTokenSymbol(null);
    setTokenDecimals(null);
    setErrorMessage(null);
    setTokenBalance(null);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
        fetchTokenDetails();
      } else if (tokenAddress === "") {
        setIsButtonEnabled(false);
      } else if (tokenAddress.length > 0) {
        setIsButtonEnabled(false);
        setErrorMessage("Invalid token address.");
      }
    }, 100);

    return () => clearTimeout(delayDebounce);
  }, [tokenAddress]);

  const fetchTokenDetails = async () => {
    try {
      setErrorMessage(null);

      const web3 = new Web3(
        Web3.givenProvider ||
          "https://sepolia.infura.io/v3/75573f1a11f84a848d4e7292fe2fb5b9"
      );

      const symbolABI = [
        {
          constant: true,
          inputs: [],
          name: "symbol",
          outputs: [{ name: "", type: "string" }],
          type: "function",
        },
      ];

      const decimalsABI = [
        {
          constant: true,
          inputs: [],
          name: "decimals",
          outputs: [{ name: "", type: "uint8" }],
          type: "function",
        },
      ];

      const symbolContract = new web3.eth.Contract(symbolABI, tokenAddress);
      const symbol = await symbolContract.methods.symbol().call();

      const decimalsContract = new web3.eth.Contract(decimalsABI, tokenAddress);
      const decimals = await decimalsContract.methods.decimals().call();

      setTokenSymbol(symbol);
      setTokenDecimals(Number(decimals));
      setIsButtonEnabled(true);
      setErrorMessage(null);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Failed to fetch token details. Please ensure the token address is correct."
      );
      setIsButtonEnabled(false);
    }
  };

  const renderImportTokenComponent = async () => {
    try {
      setIsNextButtonClicked(true);

      // Initialize web3
      const web3 = new Web3(
        Web3.givenProvider ||
          "https://sepolia.infura.io/v3/75573f1a11f84a848d4e7292fe2fb5b9"
      );

      // Get the public address from local storage or your AuthUser helper
      const publicAddress = AuthUser.getPublicKey();
      console.log("publicAddress", publicAddress);

      if (!publicAddress) {
        setErrorMessage("Public address not found.");
        setIsNextButtonClicked(false);
        return;
      }

      // Minimal ABI for calling balanceOf function
      const balanceABI = [
        {
          constant: true,
          inputs: [{ name: "_owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "balance", type: "uint256" }],
          type: "function",
        },
      ];

      // Get token balance for the given address
      const balanceContract = new web3.eth.Contract(balanceABI, tokenAddress);
      const balance = await balanceContract.methods
        .balanceOf(publicAddress)
        .call();

      // Convert balance to BigInt
      // eslint-disable-next-line no-undef
      const balanceBigInt = BigInt(balance);

      // Calculate divisor for decimals as BigInt
      const decimalDivisor = BigInt(10) ** BigInt(tokenDecimals);

      // Format balance using BigInt division
      const formattedBalance = Number(balanceBigInt / decimalDivisor);

      setTokenBalance(formattedBalance);
      setErrorMessage(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching token balance:", error);
      setErrorMessage("Failed to fetch token balance.");
    }
  };

  const renderImportTokenBackComponent = () => {
    setIsNextButtonClicked(false);
    setTokenBalance(null); // Reset balance on back
  };

  const saveImportTokenToStorage = () => {
    // Save token details to storage
  };

  return (
    <>
      {isNextButtonClicked ? (
        <>
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
                    <p className="text-sm text-blue-700">
                      Symbol: {tokenSymbol}
                    </p>
                    <p className="text-sm text-blue-700">
                      Balance: {tokenBalance}
                    </p>
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
        </>
      ) : (
        <>
          <div>
            <label
              htmlFor="token_contract_address"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Token contract address
            </label>

            <div className="mt-2">
              <input
                id="token_contract_address"
                name="token_contract_address"
                type="text"
                value={tokenAddress}
                onChange={handleAddressChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {tokenSymbol && tokenDecimals !== null && (
                <div className="mt-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Token symbol
                  </label>
                  <p>{tokenSymbol}</p>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Token decimals
                  </label>
                  <p>{tokenDecimals}</p>
                </div>
              )}
              <button
                onClick={renderImportTokenComponent}
                className={`mt-3 w-full text-white py-2 rounded-md ${
                  isButtonEnabled
                    ? "bg-blue-500"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={!isButtonEnabled}
              >
                Next
              </button>
              {errorMessage && (
                <p className="mt-2 text-red-600 text-sm">{errorMessage}</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CustomToken;
