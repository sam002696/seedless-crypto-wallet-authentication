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
      const web3 = new Web3(Network.getNetworkRpcUrl());

      const suggestedMaxPriorityFeePerGas = web3.utils.toWei("2", "gwei"); // From API: 2 Gwei
      const suggestedMaxFeePerGas = web3.utils.toWei("112.51334916", "gwei"); // From API: 112.51334916 Gwei

      const privateKey = AuthUser.getPrivateKey();
      const senderAddress = transactionData.sender.address;
      const receiverAddress = transactionData.receiver.address;
      const { tokenAddress, amount } = transactionData.transactionDetails;

      console.log("Starting transaction process...");
      console.log("Sender Address:", senderAddress);
      console.log("Receiver Address:", receiverAddress);

      const pendingTransactions = await web3.eth.getTransactionCount(
        senderAddress,
        "pending"
      );
      console.log("Pending Transactions:", pendingTransactions);

      // Fetch nonce
      const nonce = await web3.eth.getTransactionCount(
        senderAddress,
        "pending"
      );
      console.log("Nonce:", nonce);

      // Fetch gas fees
      const feeData = await web3.eth.getFeeHistory(1, "latest", [25, 75]);
      const baseFeePerGas = BigInt(feeData.baseFeePerGas[0]);
      const maxPriorityFeePerGas = BigInt(web3.utils.toWei("0.5", "gwei")); // 0.5 Gwei
      const maxFeePerGas = (baseFeePerGas + maxPriorityFeePerGas).toString();

      console.log("Base Fee Per Gas (Wei):", baseFeePerGas.toString());
      console.log(
        "Max Priority Fee Per Gas (Wei):",
        maxPriorityFeePerGas.toString()
      );
      console.log("Max Fee Per Gas (Wei):", maxFeePerGas);

      // Token Transfer
      if (tokenAddress) {
        console.log("Token Transfer Detected");

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
          to: tokenAddress,
          data,
          from: senderAddress,
        });
        const adjustedGasEstimate = Math.ceil(Number(gasEstimate) * 1.1); // Add 10% buffer
        console.log("Gas Estimate (with Buffer):", adjustedGasEstimate);

        const transactionFeeWei =
          BigInt(adjustedGasEstimate) * BigInt(maxFeePerGas);
        const transactionFeeEth = web3.utils.fromWei(
          transactionFeeWei.toString(),
          "ether"
        );

        console.log("Transaction Fee in Wei:", transactionFeeWei.toString());
        console.log("Transaction Fee in ETH:", transactionFeeEth);

        if (parseFloat(transactionFeeEth) > 1) {
          throw new Error(
            `Transaction fee (${transactionFeeEth} ETH) exceeds the 1 ETH cap.`
          );
        }

        // Simulate transaction using web3.eth.call
        console.log("Simulating transaction...");
        try {
          const simulationResult = await web3.eth.call({
            from: senderAddress,
            to: tokenAddress,
            data: data,
          });
          console.log("Simulation Result:", simulationResult);
        } catch (simulationError) {
          console.error(
            "Transaction Simulation Failed:",
            simulationError.message
          );
          throw new Error(
            "Simulation failed: The transaction would likely revert. Details: " +
              simulationError.message
          );
        }

        const gasEstimateLater = await web3.eth.estimateGas({
          from: senderAddress,
          to: tokenAddress,
          data: data,
        });
        const adjustedGasLimit = Math.ceil(Number(gasEstimateLater) * 1.2); // Add 20% buffer

        const gasPrice = await web3.eth.getGasPrice(); // Fetch current gas price
        console.log("gasPrice", gasPrice);
        const bufferedGasPrice =
          BigInt(gasPrice) + BigInt(web3.utils.toWei("20", "gwei")); // Add 10 Gwei buffer

        const pendingNonce = await web3.eth.getTransactionCount(
          senderAddress,
          "pending"
        );
        if (pendingNonce > nonce) {
          console.log(
            "Pending transactions detected. Replacing with a higher gas price..."
          );
          const cancelTx = {
            nonce: web3.utils.toHex(nonce),
            gasPrice: web3.utils.toHex(bufferedGasPrice),
            gasLimit: web3.utils.toHex(21000), // Standard gas limit for ETH transfer
            to: senderAddress, // Self-transfer
            value: "0x0", // No ETH transfer
            chainId: web3.utils.toHex(transactionData.network.chainId),
          };

          const signedCancelTx = await web3.eth.accounts.signTransaction(
            cancelTx,
            privateKey
          );
          await web3.eth.sendSignedTransaction(signedCancelTx.rawTransaction);
        }

        const tx = {
          nonce: web3.utils.toHex(nonce),
          gasPrice: web3.utils.toHex(bufferedGasPrice),

          gasLimit: web3.utils.toHex(adjustedGasLimit),
          to: tokenAddress,
          data: data,
          chainId: web3.utils.toHex(transactionData.network.chainId),
        };

        console.log("Transaction Object:", tx);

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
            alert("Transaction sent successfully! Transaction Hash: " + hash);
          })
          .on("receipt", (receipt) => {
            console.log("Transaction Receipt:", receipt);
            alert("Transaction confirmed! Receipt: " + JSON.stringify(receipt));
          })
          .on("confirmation", (confirmationNumber, receipt) => {
            console.log(
              `Confirmation ${confirmationNumber}:`,
              JSON.stringify(receipt)
            );
          })
          .on("error", (error) => {
            console.error("Transaction Error:", error);
            alert("Transaction failed: " + error.message);
          });
      }
    } catch (error) {
      console.error("Transaction Failed:", error);
      alert("Transaction failed: " + error.message);
    }
  };

  //   try {
  //     const web3 = new Web3(Network.getNetworkRpcUrl());
  //     const privateKey = AuthUser.getPrivateKey();
  //     const senderAddress = transactionData.sender.address;
  //     const receiverAddress = transactionData.receiver.address;
  //     const { tokenAddress, amount } = transactionData.transactionDetails;

  //     console.log("Starting transaction process...");
  //     console.log("Sender Address:", senderAddress);
  //     console.log("Receiver Address:", receiverAddress);

  //     // Fetch nonce
  //     const nonce = await web3.eth.getTransactionCount(
  //       senderAddress,
  //       "pending"
  //     );
  //     console.log("Nonce:", nonce);

  //     // Fetch gas price
  //     const gasPrice = await web3.eth.getGasPrice();
  //     console.log("Gas Price (Wei):", gasPrice);

  //     // Token Transfer
  //     if (tokenAddress) {
  //       console.log("Token Transfer Detected");

  //       const tokenContract = new web3.eth.Contract(
  //         [
  //           {
  //             constant: false,
  //             inputs: [
  //               { name: "_to", type: "address" },
  //               { name: "_value", type: "uint256" },
  //             ],
  //             name: "transfer",
  //             outputs: [{ name: "", type: "bool" }],
  //             type: "function",
  //           },
  //         ],
  //         tokenAddress
  //       );

  //       const data = tokenContract.methods
  //         .transfer(
  //           receiverAddress,
  //           web3.utils.toWei(amount.toString(), "ether")
  //         )
  //         .encodeABI();
  //       console.log("Encoded ABI Data:", data);

  //       // Estimate gas
  //       const gasEstimate = await web3.eth.estimateGas({
  //         to: tokenAddress,
  //         data,
  //         from: senderAddress,
  //       });
  //       const gasLimit = Math.ceil(gasEstimate * 1.1); // Add 10% buffer
  //       console.log("Gas Estimate (with Buffer):", gasLimit);

  //       // Ensure the sender has enough ETH for gas
  //       const transactionCost = BigInt(gasLimit) * BigInt(gasPrice);
  //       const senderBalance = BigInt(await web3.eth.getBalance(senderAddress));
  //       if (senderBalance < transactionCost) {
  //         throw new Error(
  //           `Insufficient funds: Balance (${web3.utils.fromWei(
  //             senderBalance.toString(),
  //             "ether"
  //           )} ETH) is less than transaction cost (${web3.utils.fromWei(
  //             transactionCost.toString(),
  //             "ether"
  //           )} ETH).`
  //         );
  //       }

  //       // Construct the transaction
  //       const tx = {
  //         nonce: web3.utils.toHex(nonce),
  //         gasPrice: web3.utils.toHex(gasPrice),
  //         gasLimit: web3.utils.toHex(gasLimit),
  //         to: tokenAddress,
  //         data: data,
  //         chainId: transactionData.network.chainId,
  //       };

  //       console.log("Transaction Object:", tx);

  //       // Sign the transaction
  //       const signedTx = await web3.eth.accounts.signTransaction(
  //         tx,
  //         privateKey
  //       );
  //       console.log("Signed Transaction:", signedTx);

  //       // Broadcast the transaction
  //       const receipt = await new Promise((resolve, reject) => {
  //         web3.eth
  //           .sendSignedTransaction(signedTx.rawTransaction)
  //           .on("transactionHash", (hash) => {
  //             console.log("Transaction Hash:", hash);
  //           })
  //           .on("receipt", (receipt) => {
  //             console.log("Transaction Receipt:", receipt);
  //             resolve(receipt);
  //           })
  //           .on("confirmation", (confirmationNumber, receipt) => {
  //             console.log(
  //               `Confirmation ${confirmationNumber}:`,
  //               JSON.stringify(receipt)
  //             );
  //           })
  //           .on("error", (error) => {
  //             console.error("Transaction Error:", error);
  //             reject(error);
  //           });
  //       });

  //       console.log("Transaction Mined Successfully:", receipt);
  //       alert("Transaction confirmed! Receipt: " + JSON.stringify(receipt));
  //       return receipt;
  //     } else {
  //       throw new Error("Token address is required for this transaction.");
  //     }
  //   } catch (error) {
  //     console.error("Transaction Failed:", error);
  //     alert("Transaction failed: " + error.message);
  //     throw error;
  //   }
  // };

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
