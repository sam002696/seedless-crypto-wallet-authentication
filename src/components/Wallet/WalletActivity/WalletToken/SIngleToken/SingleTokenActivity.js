import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { AuthUser } from "../../../../../helpers/AuthUser";
import { useSelector } from "react-redux";
import { selectNetwork } from "../../../../../reducers/networkSlice";

const SingleTokenActivity = ({ token }) => {
  const [transactions, setTransactions] = useState([]);
  const [loggedInUserAddress, setLoggedInUserAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const selectedNetworkInfo = useSelector(selectNetwork);

  const blockExplorerBaseURLs = {
    1: "https://etherscan.io",
    11155111: "https://sepolia.etherscan.io",
  };

  const getBlockExplorerURL = () => {
    const chainId = selectedNetworkInfo?.chainId;
    return blockExplorerBaseURLs[chainId] || "https://etherscan.io";
  };

  useEffect(() => {
    const fetchUserAddress = () => {
      let address = localStorage.getItem("loggedInUserAddress");
      if (!address) {
        address = AuthUser?.getLoggedInUserAddress()?.toLowerCase() || null;
        localStorage.setItem("loggedInUserAddress", address);
      }
      setLoggedInUserAddress(address);
    };

    fetchUserAddress();
  }, []);

  useEffect(() => {
    const fetchTokenTransactions = async () => {
      try {
        if (!loggedInUserAddress || !selectedNetworkInfo?.rpcUrl) {
          console.warn("User address or network RPC URL is not available.");
          return;
        }

        setLoading(true);
        const web3 = new Web3(selectedNetworkInfo.rpcUrl);

        const transferEventSignature = web3.utils.sha3(
          "Transfer(address,address,uint256)"
        );

        const options = {
          fromBlock: "earliest",
          toBlock: "latest",
          address: token.tokenAddress,
          topics: [
            transferEventSignature,
            null,
            web3.utils.padLeft(loggedInUserAddress, 64),
          ],
        };

        console.log("Fetching logs with options:", options);
        const logs = await web3.eth.getPastLogs(options);

        if (!logs || logs.length === 0) {
          console.warn("No logs found for the given options.");
          return;
        }

        const processedTransactions = await Promise.all(
          logs.map(async (log) => {
            const decodedValue = web3.eth.abi.decodeParameter(
              "uint256",
              log.data
            );

            const from = "0x" + log.topics[1].slice(26);
            const to = "0x" + log.topics[2].slice(26);

            const block = await web3.eth.getBlock(log.blockNumber);
            const timestamp = Number(block.timestamp);
            const date = new Date(timestamp * 1000).toISOString().split("T")[0];

            const receipt = await web3.eth.getTransactionReceipt(
              log.transactionHash
            );
            const status = receipt?.status ? "Confirmed" : "Pending";

            return {
              from,
              to,
              value: web3.utils.fromWei(decodedValue, "ether"),
              transactionHash: log.transactionHash,
              blockNumber: log.blockNumber,
              date,
              status,
            };
          })
        );

        const sortedTransactions = processedTransactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setTransactions(sortedTransactions);
      } catch (error) {
        console.error("Error fetching token transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenTransactions();
  }, [token, loggedInUserAddress, selectedNetworkInfo]);

  const groupedTransactions = transactions.reduce((acc, tx) => {
    if (!acc[tx.date]) {
      acc[tx.date] = [];
    }
    acc[tx.date].push(tx);
    return acc;
  }, {});

  // Updated Conditional Rendering
  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (!loading && transactions.length === 0) {
    return <div>No transactions found for this token.</div>;
  }

  const blockExplorerURL = getBlockExplorerURL();

  return (
    <div className="p-4">
      <p className="text-xl font-bold mb-4">Your Activity</p>
      {Object.keys(groupedTransactions).map((date) => (
        <div key={date} className="mb-6">
          <p className="text-lg font-semibold mb-2">{date}</p>
          {groupedTransactions[date].map((tx, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-100 rounded-lg p-4 mb-2 shadow-md"
            >
              <span className="text-gray-700">
                {tx.from === loggedInUserAddress ? "Sent" : "Received"}{" "}
                {tx.value} {token.tokenSymbol}
              </span>
              <span
                className={`${
                  tx.status === "Confirmed" ? "text-green-500" : "text-red-500"
                }`}
              >
                {tx.status}
              </span>
              <span className="text-gray-500">
                <a
                  href={`${blockExplorerURL}/tx/${tx.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  View on Block Explorer
                </a>
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SingleTokenActivity;
