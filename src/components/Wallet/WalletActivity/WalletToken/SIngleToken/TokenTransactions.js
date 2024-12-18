import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { AuthUser } from "../../../../../helpers/AuthUser";
import { Network } from "../../../../../helpers/Network";
import TransactionDetailsModal from "../../../../Modal/TransactionHashDetailsModal/TransactionHashDetailsModal";
import { useSelector } from "react-redux";
import { selectNetwork } from "../../../../../reducers/networkSlice";

const ERC20_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];

const TokenTransactions = ({ token }) => {
  const selectedNetworkInfo = useSelector(selectNetwork);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const infuraUrl = Network.getNetworkRpcUrl();
  const tokenAddress = token;
  const accountAddress = AuthUser.getPublicKey();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
  const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const latestBlock = await web3.eth.getBlockNumber();

        const fromBlock =
          Number(latestBlock) - 50000 > 0 ? Number(latestBlock) - 50000 : 0;
        const toBlock = "latest";

        const events = await tokenContract.getPastEvents("Transfer", {
          filter: {
            from: accountAddress,
          },
          fromBlock: fromBlock,
          toBlock: toBlock,
        });

        const eventsTo = await tokenContract.getPastEvents("Transfer", {
          filter: {
            to: accountAddress,
          },
          fromBlock: fromBlock,
          toBlock: toBlock,
        });

        const allEvents = [...events, ...eventsTo];

        // console.log("allEvents", allEvents);

        // Function to fetch the block and delay requests to prevent too many calls
        const fetchBlockWithDelay = async (blockNumber, delay = 100) => {
          const block = await web3.eth.getBlock(blockNumber);
          return new Promise((resolve) =>
            setTimeout(() => resolve(block), delay)
          );
        };

        // Fetching block timestamps with a delay
        const transactionsWithDates = [];
        for (let i = 0; i < allEvents.length; i++) {
          const event = allEvents[i];
          const block = await fetchBlockWithDelay(event.blockNumber);

          //   console.log(event.returnValues.value);

          // Ensuring BigInt to string conversion for the value field
          const valueInEther = web3.utils.fromWei(
            event.returnValues.value.toString(),
            "ether"
          );

          const receipt = await web3.eth.getTransactionReceipt(
            event.transactionHash
          );
          const status = receipt.status ? "Success" : "Failed";

          //   console.log(valueInEther);

          const timestamp = new Date(
            Number(block.timestamp) * 1000
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          transactionsWithDates.push({
            ...event,
            timestamp: timestamp,
            value: valueInEther,
            status: status,
          });
        }

        // Group transactions by date
        const groupedTransactions = transactionsWithDates.reduce(
          (groups, transaction) => {
            const { timestamp } = transaction;
            if (!groups[timestamp]) {
              groups[timestamp] = [];
            }
            groups[timestamp].push(transaction);
            return groups;
          },
          {}
        );

        // Convert grouped transactions to an array and sort by date in descending order
        const sortedGroupedTransactions = Object.keys(groupedTransactions)
          .sort((a, b) => new Date(b) - new Date(a)) // Sort by date, latest first
          .map((date) => ({
            date,
            transactions: groupedTransactions[date],
          }));

        setTransactions(sortedGroupedTransactions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching token transactions:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  //   console.log("transactions", transactions);

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const blockExplorerBaseURLs = {
    1: "https://etherscan.io",
    11155111: "https://sepolia.etherscan.io",
  };

  const getBlockExplorerURL = () => {
    const chainId = selectedNetworkInfo?.chainId;
    return blockExplorerBaseURLs[chainId] || "https://etherscan.io";
  };

  const blockExplorerURL = getBlockExplorerURL();

  return (
    <>
      <h2 className=" font-bold text-xl my-5">Your Activity:</h2>
      {transactions.length === 0 ? (
        loading ? (
          <>
            <p>Loading</p>
          </>
        ) : (
          <>
            <p>No transactions found.</p>
          </>
        )
      ) : (
        <ul>
          {transactions.map((group, index) => (
            <li key={index}>
              <p className="my-3 font-semibold border-b pb-2">{group.date}</p>{" "}
              {/*  date */}
              {group.transactions.map((tx, txIndex) => (
                <div
                  key={txIndex}
                  onClick={() => handleTransactionClick(tx)}
                  className="flex justify-between items-center  pb-3 mb-3 cursor-pointer"
                >
                  <div>
                    <p className="text-xl font-semibold">
                      {tx.returnValues.from === accountAddress
                        ? "Sent"
                        : "Received"}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        tx.status === "Success"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {tx.status === "Success" ? "Confirmed" : "Failed"}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {tx.returnValues.from === accountAddress ? "-" : ""}{" "}
                      {tx.value} {token.tokenSymbol}
                    </p>
                  </div>
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
      {selectedTransaction && (
        <TransactionDetailsModal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          transactionDetails={{
            status: selectedTransaction.status,
            from: selectedTransaction.returnValues.from,
            to: selectedTransaction.returnValues.to,
            transactionHash: selectedTransaction.transactionHash,
            explorerLink: `${blockExplorerURL}/tx/${selectedTransaction.transactionHash}`,
          }}
        />
      )}
    </>
  );
};

export default TokenTransactions;
