/* eslint-disable no-undef */
import React, { useState } from "react";
import TransactionDetails from "./DisplayTab/TransactionDetails";
import TransactionHex from "./DisplayTab/TransactionHex";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import { AuthUser } from "../../../helpers/AuthUser";
import { Network } from "../../../helpers/Network";

const DisplayTransaction = ({ transactionData }) => {
  const history = useHistory();
  const walletTransactionInfo = ["Details", "HEX"];
  const [walletTransaction, setWalletTransaction] = useState("Details");

  const handleRejectTransaction = () => {
    history.push("/wallet");
    localStorage.removeItem("selectedGasFeeType");
  };

  const confirmCryptoTransaction = async () => {
    try {
      const web3 = new Web3(Network.getNetworkRpcUrl()); // Use your Infura/Alchemy endpoint
      const privateKey = AuthUser.getPrivateKey(); // Sender's private key
      const senderAddress = transactionData.sender.address;
      const receiverAddress = transactionData.receiver.address;
      const { tokenAddress, amount } = transactionData.transactionDetails;

      // Fetch the current nonce for the sender's address
      const nonce = await web3.eth.getTransactionCount(
        senderAddress,
        "pending"
      );

      // Fetch the current gas price and priority fees
      const feeData = await web3.eth.getFeeHistory(1, "latest", [25, 75]);
      const maxPriorityFeePerGas = web3.utils.toWei("2", "gwei"); // Example priority fee

      console.log("maxPriorityFeePerGas", maxPriorityFeePerGas);

      const maxFeePerGas = (
        BigInt(feeData.baseFeePerGas[0]) + BigInt(maxPriorityFeePerGas)
      ).toString(); // Ensure it's a string

      console.log("maxFeePerGas", maxFeePerGas);

      // Check if the transaction is a token transfer or native transfer
      if (tokenAddress) {
        // Token transfer logic
        const tokenContract = new web3.eth.Contract(
          [
            {
              constant: false,
              inputs: [
                { name: "_to", type: "address" },
                { name: "_value", type: "uint256" },
              ],
              name: "transfer",
              outputs: [{ name: "", type: "bool" }],
              type: "function",
            },
          ],
          tokenAddress
        );

        const data = tokenContract.methods
          .transfer(
            receiverAddress,
            web3.utils.toWei(amount.toString(), "ether") // Convert amount to Wei
          )
          .encodeABI();

        const gasEstimate = await web3.eth.estimateGas({
          to: tokenAddress,
          data,
          from: senderAddress,
        });

        console.log("gasEstimate", web3.utils.toHex(Number(gasEstimate)));

        console.log("gasEstimate", web3.utils.toHex(gasEstimate));

        const tx = {
          to: tokenAddress,
          data,
          gas: web3.utils.toHex(gasEstimate),
          nonce,
          chainId: transactionData.network.chainId,
          from: senderAddress,
          maxPriorityFeePerGas: web3.utils.toHex(maxPriorityFeePerGas),
          maxFeePerGas: web3.utils.toHex(maxFeePerGas),
        };

        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey
        );

        console.log("signedTx", signedTx);

        const receipt = await web3.eth
          .sendSignedTransaction(signedTx?.rawTransaction)
          .on("transactionHash", (hash) => {
            console.log("Transaction Hash:", hash);
          })
          .on("receipt", (receipt) => {
            console.log("Transaction Receipt:", receipt);
          })
          .on("confirmation", (confirmationNumber, receipt) => {
            console.log(
              "Confirmation Number:",
              confirmationNumber,
              "Receipt:",
              receipt
            );
          })
          .on("error", (error) => {
            console.error("Error during transaction broadcast:", error);
          });

        console.log("Token transfer successful:", receipt);
      } else {
        // Native transfer logic
        const value = web3.utils.toWei(amount.toString(), "ether"); // Convert amount to Wei

        const gasEstimate = await web3.eth.estimateGas({
          to: receiverAddress,
          value,
          from: senderAddress,
        });

        console.log("gasEstimate", gasEstimate);

        const tx = {
          to: receiverAddress,
          value: web3.utils.toHex(value), // Ensure value is in hex
          gas: web3.utils.toHex(gasEstimate),
          nonce,
          chainId: transactionData.network.chainId,
          from: senderAddress,
          maxPriorityFeePerGas: web3.utils.toHex(maxPriorityFeePerGas),
          maxFeePerGas: web3.utils.toHex(maxFeePerGas),
        };

        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey
        );
        const receipt = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );

        console.log("Native transfer successful:", receipt);
      }

      // Navigate to wallet or show success notification
      history.push("/wallet");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed: " + error.message);
    }
  };

  const displayTabContent = () => {
    switch (walletTransaction) {
      case "Details":
        return <TransactionDetails transactionData={transactionData} />;
      case "HEX":
        return <TransactionHex transactionData={transactionData} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen ">
      {/* Tabs Display Start */}
      <div className="flex flex-row justify-between mt-5">
        {walletTransactionInfo.map((item) => (
          <button
            key={item}
            className={`flex-1 py-3 text-center font-bold text-base cursor-pointer ${
              walletTransaction === item
                ? "border-b-4 border-blue-500 text-blue-500"
                : "border-b-4 border-gray-300 text-gray-400"
            }`}
            onClick={() => setWalletTransaction(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="mt-4 px-3">{displayTabContent()}</div>

      <div className="flex justify-between items-center mt-6 px-4">
        <button
          onClick={handleRejectTransaction}
          className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300"
        >
          Reject
        </button>
        <button
          onClick={confirmCryptoTransaction}
          disabled={transactionData?.transactionDetails?.amount === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default DisplayTransaction;
