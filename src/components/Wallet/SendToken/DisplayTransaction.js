/* eslint-disable no-undef */
import React, { useState } from "react";
import TransactionDetails from "./DisplayTab/TransactionDetails";
import TransactionHex from "./DisplayTab/TransactionHex";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import { AuthUser } from "../../../helpers/AuthUser";
import { Network } from "../../../helpers/Network";

const DisplayTransaction = ({ transactionData }) => {
  const web3 = new Web3(Network.getNetworkRpcUrl());
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

      // const suggestedMaxPriorityFeePerGas = web3.utils.toWei("2", "gwei"); // From API: 2 Gwei
      // const suggestedMaxFeePerGas = web3.utils.toWei("112.51334916", "gwei"); // From API: 112.51334916 Gwei

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
        const adjustedGasLimit = Math.ceil(Number(gasEstimateLater) * 1.5); // Add 20% buffer

        const gasPrice = await web3.eth.getGasPrice(); // Fetch current gas price
        console.log("gasPrice", gasPrice);
        const bufferedGasPrice =
          BigInt(gasPrice) + BigInt(web3.utils.toWei("20", "gwei")); // Add 10 Gwei buffer

        const maxPriorityFee = BigInt(web3.utils.toWei("2", "gwei")); // Tip for miners
        const baseFee = BigInt(gasPrice); // Base fee from current gas price
        const maxFee = baseFee + maxPriorityFee; // Ensure maxFeePerGas includes priority fee

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
          // gasPrice: web3.utils.toHex(bufferedGasPrice),
          maxPriorityFeePerGas: web3.utils.toHex(maxPriorityFee),
          maxFeePerGas: web3.utils.toHex(maxFee),
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

  const confirmTransaction = async () => {
    try {
      // const web3 = new Web3(Network.getNetworkRpcUrl());

      const privateKey = AuthUser.getPrivateKey();
      const senderAddress = transactionData.sender.address;
      const receiverAddress = transactionData.receiver.address;
      const { tokenAddress, amount } = transactionData.transactionDetails;

      console.log("Starting transaction process...");
      console.log("Sender Address:", senderAddress);
      console.log("Receiver Address:", receiverAddress);

      // Fetch nonce
      const nonce = await web3.eth.getTransactionCount(
        senderAddress,
        "pending"
      );
      console.log("Nonce:", nonce);

      // Fetch gas fees from Infura
      const gasFeesResponse = await fetch(
        "https://gas.api.infura.io/v3/75573f1a11f84a848d4e7292fe2fb5b9/networks/11155111/suggestedGasFees"
      );
      const gasFees = await gasFeesResponse.json();

      console.log("Gas Fees Response:", gasFees);

      // Select priority level (low, medium, high)
      const priorityLevel = "high"; // Choose "low", "medium", or "high"
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

      // Check for pending transactions
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
        await web3.eth.sendSignedTransaction(signedCancelTx.rawTransaction);
      }

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
          gasLimit: 2000000,
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
      } else {
        throw new Error(
          "Token address not provided. Unable to process transaction."
        );
      }
    } catch (error) {
      console.error("Transaction Failed:", error.message);
      alert("Transaction failed: " + error.message);
    }
  };

  const confirmTxn = async () => {
    try {
      const privateKey = AuthUser.getPrivateKey();
      const senderAddress = transactionData.sender.address;
      const receiverAddress = transactionData.receiver.address;
      const { tokenAddress, amount } = transactionData.transactionDetails;

      console.log("Starting transaction process...");
      console.log("Sender Address:", senderAddress);
      console.log("Receiver Address:", receiverAddress);

      // Fetch nonce
      const nonce = await web3.eth.getTransactionCount(
        senderAddress,
        "pending"
      );
      console.log("Nonce:", nonce);

      // Fetch gas fees
      const gasFeesResponse = await fetch(
        "https://gas.api.infura.io/v3/75573f1a11f84a848d4e7292fe2fb5b9/networks/11155111/suggestedGasFees"
      );
      const gasFees = await gasFeesResponse.json();
      const suggestedGasFees = gasFees["high"];

      const maxPriorityFeePerGas = BigInt(
        web3.utils.toWei(suggestedGasFees.suggestedMaxPriorityFeePerGas, "gwei")
      );
      const maxFeePerGas = BigInt(
        web3.utils.toWei(suggestedGasFees.suggestedMaxFeePerGas, "gwei")
      );

      console.log("Max Priority Fee Per Gas:", maxPriorityFeePerGas.toString());
      console.log("Max Fee Per Gas:", maxFeePerGas.toString());

      if (!tokenAddress) {
        throw new Error(
          "Token address not provided. Unable to process transaction."
        );
      }

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
        .transfer(receiverAddress, web3.utils.toWei(amount.toString(), "ether"))
        .encodeABI();

      const gasEstimate = await web3.eth.estimateGas({
        from: senderAddress,
        to: tokenAddress,
        data,
      });
      const adjustedGasLimit = Math.ceil(Number(gasEstimate) * 1.2);

      console.log("Gas Estimate (with Buffer):", adjustedGasLimit);

      const transaction = {
        to: tokenAddress,
        value: "0x0",
        data: data,
        nonce: web3.utils.toHex(nonce),
        maxFeePerGas: web3.utils.toHex(maxFeePerGas),
        maxPriorityFeePerGas: web3.utils.toHex(maxPriorityFeePerGas),
        gasLimit: web3.utils.toHex(adjustedGasLimit),
        chainId: transactionData.network.chainId,
      };

      console.log("Transaction Object:", transaction);

      // Sign transaction
      const signedTx = await web3.eth.accounts.signTransaction(
        transaction,
        privateKey
      );
      console.log("Signed Transaction:", signedTx);

      // Send raw transaction using eth_sendRawTransaction
      const txHash = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      console.log("Transaction Hash:", txHash);

      // Poll for receipt using eth_getTransactionReceipt
      let receipt = null;
      for (let i = 0; i < 30; i++) {
        receipt = await web3.eth.getTransactionReceipt(txHash);
        if (receipt) break;
        console.log("Waiting for receipt...");
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
      }

      if (!receipt) {
        throw new Error("Transaction not mined within timeout.");
      }

      console.log("Transaction Receipt:", receipt);
      alert("Transaction confirmed! Receipt: " + JSON.stringify(receipt));
    } catch (error) {
      console.error("Transaction Failed:", error.message);
      alert("Transaction failed: " + error.message);
    }
  };

  const confirmFlashbotTxn = async () => {
    try {
      const web3 = new Web3(Network.getNetworkRpcUrl());

      const privateKey = AuthUser.getPrivateKey();
      const senderAddress = transactionData.sender.address;
      const receiverAddress = transactionData.receiver.address;
      const { tokenAddress, amount } = transactionData.transactionDetails;

      console.log("Starting transaction process...");

      // Initialize provider and wallet
      const provider = new JsonRpcProvider(Network.getNetworkRpcUrl());
      const wallet = new Wallet(privateKey, provider);

      // Fetch nonce and fee data
      const nonce = await provider.getTransactionCount(senderAddress, "latest");
      const feeData = await provider.getFeeData();

      // Calculate fees
      const baseFeePerGas = feeData.lastBaseFeePerGas
        ? BigInt(feeData.lastBaseFeePerGas)
        : parseUnits("1", "gwei"); // Fallback to 1 gwei
      const maxPriorityFeePerGas = parseUnits("2", "gwei");
      const maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas;

      console.log("Base Fee Per Gas:", baseFeePerGas.toString());
      console.log("Max Fee Per Gas:", maxFeePerGas.toString());
      console.log("Max Priority Fee Per Gas:", maxPriorityFeePerGas.toString());

      // Estimate gas
      const gasEstimate = await web3.eth.estimateGas({
        from: senderAddress,
        to: tokenAddress,
        data: web3.eth.abi.encodeFunctionCall(
          {
            name: "transfer",
            type: "function",
            inputs: [
              { name: "_to", type: "address" },
              { name: "_value", type: "uint256" },
            ],
          },
          [receiverAddress, web3.utils.toWei(amount.toString(), "ether")]
        ),
      });

      console.log("Gas Estimate (Decimal):", gasEstimate);
      console.log("Gas Estimate (Hex):", toBeHex(gasEstimate));

      // Transaction object
      const tx = {
        to: tokenAddress,
        gasLimit: toBeHex(gasEstimate),
        value: "0x0",
        nonce: toBeHex(nonce),
        data: web3.eth.abi.encodeFunctionCall(
          {
            name: "transfer",
            type: "function",
            inputs: [
              { name: "_to", type: "address" },
              { name: "_value", type: "uint256" },
            ],
          },
          [receiverAddress, web3.utils.toWei(amount.toString(), "ether")]
        ),
        maxFeePerGas: toBeHex(maxFeePerGas),
        maxPriorityFeePerGas: toBeHex(maxPriorityFeePerGas),
        chainId: 11155111, // Sepolia chain ID
      };

      console.log("Transaction Object:", tx);

      // Send the transaction details to the backend
      const response = await fetch("http://localhost:4000/flashbots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          privateKey,
          transaction: tx,
          networkRpcUrl: Network.getNetworkRpcUrl(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to relay transaction");
      }

      const result = await response.json();
      console.log("Flashbots Response:", result);
    } catch (error) {
      console.error("Transaction Failed:", error.message);
      alert("Transaction failed: " + error.message);
    }
  };

  // Poll for the transaction receipt manually
  const pollForReceipt = async (hash) => {
    try {
      let receipt = null;
      for (let i = 0; i < 30; i++) {
        // Poll for up to 30 attempts (e.g., 150 seconds total)
        receipt = await web3.eth.getTransactionReceipt(hash);
        if (receipt) {
          console.log("Transaction Receipt (polled):", receipt);
          alert(
            "Transaction confirmed (polled)! Receipt: " +
              JSON.stringify(receipt)
          );
          break;
        }
        console.log("Waiting for receipt...");
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
      }

      if (!receipt) {
        throw new Error("Transaction not mined within timeout.");
      }
    } catch (error) {
      console.error("Error during receipt polling:", error.message);
      alert("Error during receipt polling: " + error.message);
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
          onClick={confirmTransaction}
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
