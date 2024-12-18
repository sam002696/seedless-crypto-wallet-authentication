import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { AuthUser } from "../../../../../helpers/AuthUser";
import { Network } from "../../../../../helpers/Network";

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
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const infuraUrl = Network.getNetworkRpcUrl();
  const tokenAddress = token;
  const accountAddress = AuthUser.getPublicKey();

  const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
  const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const events = await tokenContract.getPastEvents("Transfer", {
          filter: {
            from: accountAddress,
          },
          fromBlock: "earliest",
          toBlock: "latest",
        });

        const eventsTo = await tokenContract.getPastEvents("Transfer", {
          filter: {
            to: accountAddress,
          },
          fromBlock: "earliest",
          toBlock: "latest",
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

  return (
    <div>
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
                  className="flex justify-between items-center  pb-3 mb-3"
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
    </div>
  );
};

export default TokenTransactions;
