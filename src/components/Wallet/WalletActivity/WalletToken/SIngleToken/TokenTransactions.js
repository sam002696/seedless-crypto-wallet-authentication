import React, { useEffect, useState } from "react";
import Web3 from "web3";

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

const TokenTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  const infuraUrl =
    "https://sepolia.infura.io/v3/75573f1a11f84a848d4e7292fe2fb5b9";
  const tokenAddress = "0x8E2fC77A7cc7A3d3A8Bb006aaE655475Fd171Ac0";
  const accountAddress = "0x35642E4c431e893DeFd805644c33BBFF3077a56D";

  const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
  const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const events = await tokenContract.getPastEvents("Transfer", {
          filter: {
            // Match either 'from' or 'to'
            from: accountAddress, // Sent tokens
          },
          fromBlock: "earliest",
          toBlock: "latest",
        });

        const eventsTo = await tokenContract.getPastEvents("Transfer", {
          filter: {
            to: accountAddress, // Received tokens
          },
          fromBlock: "earliest",
          toBlock: "latest",
        });

        setTransactions([...events, ...eventsTo]);
      } catch (error) {
        console.error("Error fetching token transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  console.log("transactions", transactions);

  return (
    <div>
      <h2>Token Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul>
          {transactions.map((tx, index) => (
            <li key={index}>
              <strong>From:</strong> {tx.returnValues.from} |{" "}
              <strong>To:</strong> {tx.returnValues.to} |{" "}
              <strong>Value:</strong>{" "}
              {web3.utils.fromWei(tx.returnValues.value, "ether")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TokenTransactions;
