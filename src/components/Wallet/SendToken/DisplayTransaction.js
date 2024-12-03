import React, { useState } from "react";
import TransactionDetails from "./DisplayTab/TransactionDetails";
import TransactionHex from "./DisplayTab/TransactionHex";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import { AuthUser } from "../../../helpers/AuthUser";
import BN from "bn.js";

const DisplayTransaction = ({ transactionData }) => {
  const history = useHistory();
  const walletTransactionInfo = ["Details", "HEX"];
  const [walletTransaction, setWalletTransaction] = useState("Details");
  const [transactionHex, setTransactionHex] = useState(null); // State for transaction hash
  const [gasUsed, setGasUsed] = useState(null); // State for gas used
  const [transactionFee, setTransactionFee] = useState(null); // State for transaction fee

  const handleRejectTransaction = () => {
    history.push("/wallet");
    localStorage.removeItem("selectedGasFeeType");
  };

  const confirmCryptoTransaction = async () => {
    try {
      const { sender, receiver, transactionDetails, network } = transactionData;
      const { address: fromAddress } = sender;
      const { address: toAddress } = receiver;
      const { tokenAddress, amount } = transactionDetails;
      const { chainId } = network;

      const rpcUrls = {
        1: "https://mainnet.infura.io/v3/75573f1a11f84a848d4e7292fe2fb5b9", // Ethereum Mainnet
        11155111:
          "https://sepolia.infura.io/v3/75573f1a11f84a848d4e7292fe2fb5b9", // Sepolia Testnet
      };

      const web3 = new Web3(rpcUrls[chainId]);

      let txHash;
      let gasUsedValue;
      let transactionFeeValue;
      const privateKey = AuthUser.getPrivateKey(); // Ensure this retrieves the private key correctly

      if (tokenAddress) {
        // ERC20 Token Transfer
        const erc20Abi = [
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
        ];

        const contract = new web3.eth.Contract(erc20Abi, tokenAddress);
        const decimals = 18; // Adjust based on token decimals
        const value = new BN(amount).mul(new BN(10).pow(new BN(decimals))); // Use BN for big numbers

        const data = contract.methods
          .transfer(toAddress, value.toString())
          .encodeABI(); // Ensure value is passed as a string

        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await web3.eth.estimateGas({
          from: fromAddress,
          to: tokenAddress,
          data,
        });

        const tx = {
          from: fromAddress,
          to: tokenAddress,
          data,
          gas: gasEstimate,
          gasPrice,
          chainId,
        };

        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey
        );

        const receipt = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );

        txHash = receipt.transactionHash;
        gasUsedValue = receipt.gasUsed;
        transactionFeeValue = web3.utils.fromWei(
          new BN(gasUsedValue).mul(new BN(gasPrice)),
          "ether"
        );
      } else {
        // Native Token Transfer
        const value = web3.utils.toWei(amount.toString(), "ether");

        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await web3.eth.estimateGas({
          from: fromAddress,
          to: toAddress,
          value,
        });

        const tx = {
          from: fromAddress,
          to: toAddress,
          value,
          gas: gasEstimate,
          gasPrice,
          chainId,
        };

        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey
        );

        const receipt = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );

        txHash = receipt.transactionHash;
        gasUsedValue = receipt.gasUsed;
        transactionFeeValue = web3.utils.fromWei(
          new BN(gasUsedValue).mul(new BN(gasPrice)),
          "ether"
        );
      }

      // Update State with Transaction Details
      setTransactionHex(txHash);
      setGasUsed(gasUsedValue);
      setTransactionFee(transactionFeeValue);

      // Switch to HEX tab to display the transaction hash
      setWalletTransaction("HEX");
    } catch (error) {
      console.error("Transaction Failed:", error.message);
      alert("Transaction Failed: " + error.message);
    }
  };

  const displayTabContent = () => {
    switch (walletTransaction) {
      case "Details":
        return (
          <TransactionDetails
            transactionData={transactionData}
            gasUsed={gasUsed}
            transactionFee={transactionFee}
          />
        );
      case "HEX":
        return <TransactionHex transactionHex={transactionHex} />;
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
