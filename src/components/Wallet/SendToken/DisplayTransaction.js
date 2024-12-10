/* eslint-disable no-undef */
import React, { useState } from "react";
import TransactionDetails from "./DisplayTab/TransactionDetails";
import TransactionHex from "./DisplayTab/TransactionHex";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import { AuthUser } from "../../../helpers/AuthUser";
import { Network } from "../../../helpers/Network";
import { ToastAlert } from "../../../notification";

const DisplayTransaction = ({ transactionData }) => {
  const savedGasType = localStorage.getItem("selectedGasFeeType");
  const web3 = new Web3(Network.getNetworkRpcUrl());
  const history = useHistory();
  const walletTransactionInfo = ["Details", "HEX"];
  const [transactionReceiptInfo, setTransactionReceiptInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [walletTransaction, setWalletTransaction] = useState("Details");

  const handleRejectTransaction = () => {
    history.push("/wallet");
    localStorage.removeItem("selectedGasFeeType");
  };

  const checkPriorityLevel = (item) => {
    if (!item) {
      console.warn("Invalid savedGasType; defaulting to 'medium'.");
      return "medium"; // Default priority level
    }

    switch (item) {
      case "market":
        return "medium";
      case "agressive":
        return "high";
      case "low":
        return "low";
      default:
        console.warn(
          `Unknown priority level: ${item}; defaulting to 'medium'.`
        );
        return "medium";
    }
  };

  console.log("savedGasType", savedGasType);

  const confirmTransaction = async () => {
    try {
      setLoading(true);

      ToastAlert("info", "Transaction process started...");

      const privateKey = AuthUser.getPrivateKey();
      const senderAddress = transactionData.sender.address;
      const receiverAddress = transactionData.receiver.address;
      const { tokenAddress, amount } = transactionData.transactionDetails;

      console.log("Starting transaction process...");
      console.log("Sender Address:", senderAddress);
      console.log("Receiver Address:", receiverAddress);

      // Fetch sender's balance
      const balance = BigInt(await web3.eth.getBalance(senderAddress));
      console.log(
        "Sender Balance:",
        web3.utils.fromWei(balance.toString(), "ether")
      );

      // Fetch nonce
      const nonce = await web3.eth.getTransactionCount(senderAddress, "latest");
      console.log("Nonce:", nonce);

      // Fetch gas fees from Infura
      const gasFeesResponse = await fetch(
        "https://gas.api.infura.io/v3/75573f1a11f84a848d4e7292fe2fb5b9/networks/11155111/suggestedGasFees"
      );
      const gasFees = await gasFeesResponse.json();

      console.log("Gas Fees Response:", gasFees);

      const priorityLevel = checkPriorityLevel(savedGasType?.toLowerCase());

      console.log("priorityLevel", priorityLevel);

      const suggestedGasFees = gasFees[priorityLevel];

      const maxPriorityFeePerGas = BigInt(
        web3.utils.toWei(
          (suggestedGasFees.suggestedMaxPriorityFeePerGas * 1.1).toString(),
          "gwei"
        )
      );
      const maxFeePerGas = BigInt(
        web3.utils.toWei(
          (suggestedGasFees.suggestedMaxFeePerGas * 1.1).toString(),
          "gwei"
        )
      );

      console.log("Max Priority Fee Per Gas:", maxPriorityFeePerGas.toString());
      console.log("Max Fee Per Gas:", maxFeePerGas.toString());

      // Estimate gas cost
      const gasLimit = 21000n; // Standard gas limit for ETH transfers
      const estimatedGasCost = gasLimit * maxFeePerGas;

      console.log(
        "Estimated Gas Cost:",
        web3.utils.fromWei(estimatedGasCost.toString(), "ether")
      );

      // Ensure sufficient balance
      if (balance < estimatedGasCost) {
        ToastAlert(
          "error",
          "Insufficient funds to cover the transaction gas cost."
        );
        setLoading(false);
        return;
      }

      // Check for pending transactions
      const pendingNonce = await web3.eth.getTransactionCount(
        senderAddress,
        "pending"
      );
      if (pendingNonce > nonce) {
        console.log(
          `Pending transactions detected: from nonce ${nonce} to ${
            pendingNonce - 1
          }`
        );

        for (let nonceInfo = nonce; nonceInfo < pendingNonce; nonceInfo++) {
          const cancelTx = {
            nonce: web3.utils.toHex(nonceInfo), // Use loop variable nonceInfo
            gasPrice: web3.utils.toHex(
              maxFeePerGas + BigInt(web3.utils.toWei("5", "gwei")) // Add buffer for cancellation
            ),
            gasLimit: web3.utils.toHex(21000), // Standard gas limit
            to: senderAddress, // Self-transfer
            value: "0x0",
            chainId: web3.utils.toHex(transactionData.network.chainId),
          };

          const signedCancelTx = await web3.eth.accounts.signTransaction(
            cancelTx,
            privateKey
          );

          try {
            const receipt = await web3.eth.sendSignedTransaction(
              signedCancelTx.rawTransaction
            );
            console.log(
              `Cancellation transaction with nonce ${nonceInfo} sent successfully.`,
              receipt.transactionHash
            );
          } catch (error) {
            console.error(
              `Failed to cancel transaction with nonce ${nonceInfo}:`,
              error.message
            );
            break; // Stop if cancellation fails
          }
        }
      }

      // Token Transfer
      if (tokenAddress) {
        console.log("Token Transfer Detected");
        ToastAlert("info", "Token transfer initiated...");

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
            web3.utils.toWei(amount.toString(), "ether")
          )
          .encodeABI();
        console.log("Encoded ABI Data:", data);

        const gasEstimate = await web3.eth.estimateGas({
          from: senderAddress,
          to: tokenAddress,
          data,
        });
        const adjustedGasLimit = Math.ceil(Number(gasEstimate) * 1.5); // Add 50% buffer
        console.log("Gas Estimate (with Buffer):", adjustedGasLimit);

        // Simulate transaction
        try {
          const simulationResult = await web3.eth.call({
            from: senderAddress,
            to: tokenAddress,
            data,
          });
          console.log("Simulation Result:", simulationResult);
        } catch (simulationError) {
          console.error(
            "Transaction Simulation Failed:",
            simulationError.message
          );
          throw new Error(
            "Simulation failed: The transaction would likely revert."
          );
        }

        // Prepare transaction object
        const tx = {
          nonce: web3.utils.toHex(nonce),
          maxPriorityFeePerGas: web3.utils.toHex(maxPriorityFeePerGas),
          maxFeePerGas: web3.utils.toHex(maxFeePerGas),
          gasLimit: 200000,
          to: tokenAddress,
          data: data,
          chainId: web3.utils.toHex(transactionData.network.chainId),
        };

        console.log("Transaction Object:", tx);

        // Sign and send transaction
        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey
        );
        console.log("Signed Transaction:", signedTx);

        const promiEvent = web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );

        promiEvent
          .on("transactionHash", (hash) => {
            console.log("Transaction Hash:", hash);

            // alert("Transaction sent successfully! Transaction Hash: " + hash);
            ToastAlert(
              "success",
              `Transaction sent successfully! Hash: ${hash}`
            );
          })
          .on("receipt", (receipt) => {
            console.log("Transaction Receipt:", receipt);
            // alert("Transaction confirmed!");
            ToastAlert("success", "Transaction confirmed!");
            setTransactionReceiptInfo(receipt);
            const status = Number(receipt?.status);
            if (status === 1) {
              // localStorage.removeItem("dataToSend");
              history.push("/wallet");
            }
          })
          // .on("confirmation", (confirmationNumber, receipt) => {
          //   console.log(
          //     `Confirmation ${confirmationNumber}:`,
          //     JSON.stringify(receipt)
          //   );
          // })
          .on("error", (error) => {
            setLoading(false);
            console.error("Transaction Error:", error);

            // if (error.message.includes("insufficient funds")) {
            //   ToastAlert(
            //     "error",
            //     "Insufficient funds for gas and transaction value."
            //   );
            // } else {
            //   ToastAlert("error", `Transaction failed: ${error.message}`);
            // }

            alert("Transaction failed: " + error.message);
          })
          .finally(() => {
            setLoading(false);
            // ToastAlert("info", "Transaction process completed.");
          });
      } else {
        console.log("Native Balance Transfer Detected");

        const valueToSend = web3.utils.toWei(amount.toString(), "ether"); // Convert amount to Wei
        console.log("Amount to Send in Wei:", valueToSend);

        // Prepare transaction object
        const tx = {
          nonce: web3.utils.toHex(nonce),
          maxPriorityFeePerGas: web3.utils.toHex(maxPriorityFeePerGas),
          maxFeePerGas: web3.utils.toHex(maxFeePerGas),
          gasLimit: 21000, // Standard gas limit for ETH transfer
          to: receiverAddress,
          value: web3.utils.toHex(valueToSend),
          chainId: web3.utils.toHex(transactionData.network.chainId),
        };

        console.log("Native Transaction Object:", tx);

        // Sign and send the transaction
        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey
        );
        console.log("Signed Native Transaction:", signedTx);

        const promiEvent = web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );

        promiEvent
          .on("transactionHash", (hash) => {
            console.log("Native Transaction Hash:", hash);
            alert("Transaction sent successfully! Transaction Hash: " + hash);
          })
          .on("receipt", (receipt) => {
            console.log("Native Transaction Receipt:", receipt);
            alert("Transaction confirmed!");
            setTransactionReceiptInfo(receipt);

            // const status = Number(receipt?.status);
            // if (status === 1) {
            //   history.push("/wallet");
            // }
          })
          .on("error", (error) => {
            console.error("Native Transaction Error:", error);
            alert("Transaction failed: " + error.message);
          })
          .finally(() => {
            setLoading(false);
            // ToastAlert("info", "Transaction process completed.");
          });
      }
    } catch (error) {
      setLoading(false);
      console.error("Transaction Failed:", error.message);
      // alert("Transaction failed: " + error.message);

      ToastAlert("error", `Transaction failed: ${error.message}`);
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

  console.log("transactionReceipt :>> ", transactionReceiptInfo);

  return (
    <div className="flex flex-col min-h-screen ">
      {/* Tabs Display */}
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

      {/* Content */}
      <div className="mt-4 px-3">{displayTabContent()}</div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6 px-4">
        <button
          disabled={loading}
          onClick={handleRejectTransaction}
          className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Reject
        </button>
        {/* <button
          onClick={confirmTransaction}
          disabled={
            transactionData?.transactionDetails?.amount === 0 || loading
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Confirm
        </button> */}

        <button
          type="button"
          onClick={confirmTransaction}
          disabled={
            transactionData?.transactionDetails?.amount === 0 || loading
          }
          class="bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading && (
            <svg
              class="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {loading ? "Processing" : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default DisplayTransaction;
