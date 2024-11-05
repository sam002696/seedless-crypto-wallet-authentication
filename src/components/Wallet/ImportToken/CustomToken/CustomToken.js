import React, { useState } from "react";
import Web3 from "web3";

const CustomToken = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState(null);
  const [tokenDecimals, setTokenDecimals] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  console.log("tokenDecimals", tokenDecimals);

  const handleAddressChange = (e) => {
    setTokenAddress(e.target.value);
    setTokenSymbol(null);
    setTokenDecimals(null);
    setErrorMessage(null);
  };

  const fetchTokenDetails = async () => {
    try {
      if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
        setErrorMessage("Invalid token address.");
        return;
      }

      // Initialize web3
      const web3 = new Web3(
        Web3.givenProvider ||
          "https://sepolia.infura.io/v3/75573f1a11f84a848d4e7292fe2fb5b9"
      );

      // Minimal ABI for calling symbol and decimals functions
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

      // Call symbol function
      const symbolContract = new web3.eth.Contract(symbolABI, tokenAddress);
      const symbol = await symbolContract.methods.symbol().call();

      // Call decimals function
      const decimalsContract = new web3.eth.Contract(decimalsABI, tokenAddress);
      const decimals = await decimalsContract.methods.decimals().call();

      console.log("symbol", symbol);
      console.log("decimals", typeof decimals);

      setTokenSymbol(symbol);
      setTokenDecimals(Number(decimals));
      setErrorMessage(null);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Failed to fetch token details. Please ensure the token address is correct."
      );
    }
  };

  return (
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
        <button
          onClick={fetchTokenDetails}
          className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Next
        </button>
        {errorMessage && (
          <p className="mt-2 text-red-600 text-sm">{errorMessage}</p>
        )}
      </div>

      {tokenSymbol && tokenDecimals !== null && (
        <div className="mt-4">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Token symbol
          </label>
          <p>{tokenSymbol}</p>
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Token decimals
          </label>
          <p>{tokenDecimals} hello</p>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => {
                /* Implement back button functionality here */
              }}
              className="bg-gray-200 py-2 px-4 rounded-md"
            >
              Back
            </button>
            <button
              onClick={() => {
                /* Implement import token functionality here */
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Import
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomToken;
