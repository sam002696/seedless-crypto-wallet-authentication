import React, { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useSelector } from "react-redux";
import { selectNetwork } from "../../../reducers/networkSlice";

const TransactionDetailsModal = ({ open, setOpen, transactionDetails }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const etherscanApiKey = "KX65JXMRU6E2J69JZY8CTW12ZN52QTYK6D"; // Replace with your actual API key
  const selectedNetworkInfo = useSelector(selectNetwork);

  // Function to get the correct Etherscan API URL based on network
  const getEtherscanApiUrl = () => {
    const chainId = selectedNetworkInfo?.chainId;

    switch (chainId) {
      case 1:
        return "https://api.etherscan.io";
      case 11155111:
        return "https://api-sepolia.etherscan.io";
      case 5:
        return "https://api-goerli.etherscan.io";
      default:
        throw new Error("Unsupported network for Etherscan API");
    }
  };

  const fetchTransactionDetails = async (transactionHash) => {
    try {
      const baseUrl = getEtherscanApiUrl();

      const transactionResponse = await fetch(
        `${baseUrl}/api?module=proxy&action=eth_getTransactionByHash&txhash=${transactionHash}&apikey=${etherscanApiKey}`
      );
      const transactionData = await transactionResponse.json();

      const receiptResponse = await fetch(
        `${baseUrl}/api?module=proxy&action=eth_getTransactionReceipt&txhash=${transactionHash}&apikey=${etherscanApiKey}`
      );
      const receiptData = await receiptResponse.json();

      if (transactionData.result && receiptData.result) {
        return {
          transaction: transactionData.result,
          receipt: receiptData.result,
        };
      }
      throw new Error("Failed to fetch transaction or receipt details.");
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (transactionDetails?.transactionHash) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          setError(null);

          const { transaction, receipt } = await fetchTransactionDetails(
            transactionDetails.transactionHash
          );

          const gasUsed = parseInt(receipt.gasUsed, 16);
          const gasPrice = parseInt(transaction.gasPrice, 16);
          const totalFee = (gasUsed * gasPrice) / 1e18; // Convert to Ether

          setDetails({
            from: transaction.from,
            to: transaction.to,
            nonce: parseInt(transaction.nonce, 16),
            value: (parseInt(transaction.value, 16) / 1e18).toFixed(6),
            gasLimit: parseInt(transaction.gas, 16),
            gasUsed,
            gasPriceGwei: (gasPrice / 1e9).toFixed(6),
            maxFeePerGas: (
              parseInt(transaction.maxFeePerGas, 16) / 1e9
            ).toFixed(6),
            priorityFee: (
              parseInt(transaction.maxPriorityFeePerGas, 16) / 1e9
            ).toFixed(6),
            totalFee: totalFee.toFixed(6),
            status: receipt.status === "0x1" ? "Confirmed" : "Failed",
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [transactionDetails]);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-10"
    >
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <DialogPanel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            {loading ? (
              <p>Loading transaction details...</p>
            ) : error ? (
              <p className="text-red-600">Error: {error}</p>
            ) : (
              details && (
                <div>
                  <h2 className="text-lg font-bold text-center mb-4">
                    {details.value > 0 ? "Receive ARISPAY" : "Send ARISPAY"}
                  </h2>
                  <div className="flex justify-between items-start bg-gray-100 rounded-lg p-4 mb-2 shadow-md mt-5">
                    {/* First Column for Contract Address */}
                    <div className="flex flex-col mr-4">
                      <span className="text-md font-semibold p-1">Status</span>
                      <span
                        className={`font-medium p-1 ${
                          details.status === "Confirmed"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {details.status}
                      </span>
                    </div>

                    {/* Second Column for Contract Address */}
                    <div className="flex flex-col">
                      <span className="text-gray-700 text-end mr-3 p-1">
                        <a
                          href={`https://sepolia.etherscan.io/tx/${transactionDetails.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View on block explorer
                        </a>
                      </span>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            transactionDetails.transactionHash
                          )
                        }
                        className="text-blue-600 hover:underline p-1"
                      >
                        Copy transaction ID
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-start rounded-lg p-4 mb-2 mt-5">
                    {/* First Column for Contract Address */}
                    <div className="flex flex-col mr-4">
                      <span className="text-md font-semibold p-1">FROM</span>
                      <span className="bg-yellow-200 p-2 px-3 rounded-full">
                        {details.from.slice(0, 5)}...{details.from.slice(-4)}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-md font-semibold p-1 text-end">
                        TO
                      </span>
                      <span className="bg-gray-200 p-2 px-3 rounded-full">
                        {details.to.slice(0, 5)}...{details.to.slice(-4)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-md font-bold text-start px-4">
                      Transaction
                    </h2>
                    <div className="flex justify-between items-start rounded-lg p-4 mb-2">
                      {/* First Column for Contract Address */}
                      <div className="flex flex-col mr-4">
                        <span className="text-sm font-normal p-1">Nonce</span>
                        <span className="text-sm font-normal p-1">Amount</span>
                        <span className="text-sm font-normal p-1">
                          Gas Limit (Units)
                        </span>
                        <span className="text-sm font-normal p-1">
                          Gas Used (Units)
                        </span>
                        <span className="text-sm font-normal p-1">
                          Base Fee (GWEI)
                        </span>
                        <span className="text-sm font-normal p-1">
                          Priority Fee (GWEI)
                        </span>
                        <span className="text-sm font-normal p-1">
                          Total gas fee
                        </span>
                        <span className="text-sm font-normal p-1">
                          Max fee per gas
                        </span>
                        <span className="text-sm font-normal p-1">
                          Total Fee
                        </span>
                      </div>

                      <div className="flex flex-col text-end">
                        <span className="text-sm font-normal p-1">
                          {details.nonce}
                        </span>
                        <span className="text-sm font-normal p-1">
                          {details.value}{" "}
                        </span>
                        <span className="text-sm font-normal p-1">
                          {details.gasLimit}
                        </span>
                        <span className="text-sm font-normal p-1">
                          {details.gasUsed}
                        </span>
                        <span className="text-sm font-normal p-1">
                          {details.gasPriceGwei}
                        </span>
                        <span className="text-sm font-normal p-1">
                          {details.priorityFee}
                        </span>
                        <span className="text-sm font-normal p-1">
                          Total gas fee
                        </span>
                        <span className="text-sm font-normal p-1">
                          Max fee per gas
                        </span>
                        <span className="text-sm font-normal p-1">
                          {details.totalFee}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full py-2 bg-gray-100 text-center rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default TransactionDetailsModal;
