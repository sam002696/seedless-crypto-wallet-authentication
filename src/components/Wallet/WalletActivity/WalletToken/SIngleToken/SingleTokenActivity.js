/* eslint-disable no-undef */
// import React, { useEffect, useState } from "react";
// import Web3 from "web3";
// import { AuthUser } from "../../../../../helpers/AuthUser";
// import { useSelector } from "react-redux";
// import { selectNetwork } from "../../../../../reducers/networkSlice";
// import TransactionDetailsModal from "../../../../Modal/TransactionHashDetailsModal/TransactionHashDetailsModal";

// const SingleTokenActivity = ({ token }) => {
//   const [transactions, setTransactions] = useState([]);
//   const [loggedInUserAddress, setLoggedInUserAddress] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const selectedNetworkInfo = useSelector(selectNetwork);

//   console.log("selectedNetworkInfo", selectedNetworkInfo);

//   const blockExplorerBaseURLs = {
//     1: "https://etherscan.io",
//     11155111: "https://sepolia.etherscan.io",
//   };

//   const getBlockExplorerURL = () => {
//     const chainId = selectedNetworkInfo?.chainId;
//     return blockExplorerBaseURLs[chainId] || "https://etherscan.io";
//   };

//   useEffect(() => {
//     const fetchUserAddress = () => {
//       let address = localStorage.getItem("loggedInUserAddress");
//       if (!address) {
//         address = AuthUser?.getLoggedInUserAddress()?.toLowerCase() || null;
//         localStorage.setItem("loggedInUserAddress", address);
//       }
//       setLoggedInUserAddress(address);
//     };

//     fetchUserAddress();
//   }, []);

//   useEffect(() => {
//     const fetchTokenTransactions = async () => {
//       try {
//         if (!loggedInUserAddress || !selectedNetworkInfo?.rpcUrl) {
//           console.warn("User address or network RPC URL is not available.");
//           return;
//         }

//         setLoading(true);
//         const web3 = new Web3(selectedNetworkInfo.rpcUrl);

//         const transferEventSignature = web3.utils.sha3(
//           "Transfer(address,address,uint256)"
//         );

//         const options = {
//           fromBlock: "earliest",
//           toBlock: "latest",
//           address: token.tokenAddress,
//           topics: [
//             transferEventSignature,
//             null,
//             web3.utils.padLeft(loggedInUserAddress, 64),
//           ],
//         };

//         console.log("Fetching logs with options:", options);
//         const logs = await web3.eth.getPastLogs(options);

//         if (!logs || logs.length === 0) {
//           console.warn("No logs found for the given options.");
//           return;
//         }

//         const processedTransactions = await Promise.all(
//           logs.map(async (log) => {
//             const decodedValue = web3.eth.abi.decodeParameter(
//               "uint256",
//               log.data
//             );

//             const from = "0x" + log.topics[1].slice(26);
//             const to = "0x" + log.topics[2].slice(26);

//             const block = await web3.eth.getBlock(log.blockNumber);
//             const timestamp = Number(block.timestamp);
//             const date = new Date(timestamp * 1000).toISOString().split("T")[0];

//             const receipt = await web3.eth.getTransactionReceipt(
//               log.transactionHash
//             );
//             const status = receipt?.status ? "Confirmed" : "Pending";

//             return {
//               from,
//               to,
//               value: web3.utils.fromWei(decodedValue, "ether"),
//               transactionHash: log.transactionHash,
//               blockNumber: log.blockNumber,
//               date,
//               status,
//             };
//           })
//         );

//         const sortedTransactions = processedTransactions.sort(
//           (a, b) => new Date(b.date) - new Date(a.date)
//         );

//         setTransactions(sortedTransactions);
//       } catch (error) {
//         console.error("Error fetching token transactions:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTokenTransactions();
//   }, [token, loggedInUserAddress, selectedNetworkInfo]);

//   const groupedTransactions = transactions.reduce((acc, tx) => {
//     if (!acc[tx.date]) {
//       acc[tx.date] = [];
//     }
//     acc[tx.date].push(tx);
//     return acc;
//   }, {});

//   // Handle transaction click to open modal
//   const handleTransactionClick = (transaction) => {
//     setSelectedTransaction(transaction);
//     setIsModalOpen(true);
//   };

//   if (loading) {
//     return <div>Loading transactions...</div>;
//   }

//   if (!loading && transactions.length === 0) {
//     return <div>No transactions found for this token.</div>;
//   }

//   const blockExplorerURL = getBlockExplorerURL();

//   return (
//     <div className="p-4">
//       <p className="text-xl font-bold mb-4">Your Activity</p>
//       {Object.keys(groupedTransactions).map((date) => (
//         <div key={date} className="mb-6">
//           <p className="text-lg font-semibold mb-2">{date}</p>
//           {groupedTransactions[date].map((tx, index) => (
//             <div
//               key={index}
//               onClick={() => handleTransactionClick(tx)}
//               className="flex justify-between items-center bg-gray-100 rounded-lg p-4 mb-2 shadow-md cursor-pointer hover:bg-gray-200"
//             >
//               <span className="text-gray-700">
//                 {tx.from === loggedInUserAddress ? "Sent" : "Received"}{" "}
//                 {tx.value} {token.tokenSymbol}
//               </span>
//               <span
//                 className={`${
//                   tx.status === "Confirmed" ? "text-green-500" : "text-red-500"
//                 }`}
//               >
//                 {tx.status}
//               </span>
//               <span className="text-gray-500">
//                 <a
//                   href={`${blockExplorerURL}/tx/${tx.transactionHash}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500"
//                 >
//                   View on Block Explorer
//                 </a>
//               </span>
//             </div>
//           ))}
//         </div>
//       ))}

//       {/* Transaction Details Modal */}
//       {selectedTransaction && (
//         <TransactionDetailsModal
//           open={isModalOpen}
//           setOpen={setIsModalOpen}
//           transactionDetails={{
//             status: selectedTransaction.status,
//             from: selectedTransaction.from,
//             to: selectedTransaction.to,
//             transactionHash: selectedTransaction.transactionHash,
//             explorerLink: `${blockExplorerURL}/tx/${selectedTransaction.transactionHash}`,
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default SingleTokenActivity;

import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { AuthUser } from "../../../../../helpers/AuthUser";
import { useSelector } from "react-redux";
import { selectNetwork } from "../../../../../reducers/networkSlice";
import TransactionDetailsModal from "../../../../Modal/TransactionHashDetailsModal/TransactionHashDetailsModal";

const SingleTokenActivity = ({ token }) => {
  const [transactions, setTransactions] = useState([]);
  const [loggedInUserAddress, setLoggedInUserAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedNetworkInfo = useSelector(selectNetwork);

  const blockExplorerBaseURLs = {
    1: "https://etherscan.io",
    11155111: "https://sepolia.etherscan.io",
  };

  const getBlockExplorerURL = () => {
    const chainId = selectedNetworkInfo?.chainId;
    return blockExplorerBaseURLs[chainId] || "https://etherscan.io";
  };

  const fetchUserAddress = () => {
    let address = localStorage.getItem("loggedInUserAddress");
    if (!address) {
      address = AuthUser?.getLoggedInUserAddress()?.toLowerCase() || null;
      localStorage.setItem("loggedInUserAddress", address);
    }
    setLoggedInUserAddress(address);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchLogsInChunks = async (
    web3,
    options,
    chunkSize = 1000,
    delay = 300
  ) => {
    let fromBlock = 0;
    const latestBlock = BigInt(await web3.eth.getBlockNumber());
    let logs = [];

    while (BigInt(fromBlock) <= latestBlock) {
      const toBlock = BigInt(fromBlock) + BigInt(chunkSize) - BigInt(1);
      const adjustedToBlock = toBlock > latestBlock ? latestBlock : toBlock;

      const chunkOptions = {
        ...options,
        fromBlock: `0x${fromBlock.toString(16)}`,
        toBlock: `0x${adjustedToBlock.toString(16)}`,
      };

      try {
        const chunkLogs = await web3.eth.getPastLogs(chunkOptions);
        logs = logs.concat(chunkLogs);
      } catch (error) {
        console.error(
          `Error fetching logs for block range ${chunkOptions.fromBlock}-${chunkOptions.toBlock}:`,
          error
        );
        break; // Exit on persistent errors
      }

      fromBlock += chunkSize;
      await sleep(delay); // Add delay between requests
    }

    return logs;
  };

  const fetchTokenTransactions = async () => {
    try {
      if (!loggedInUserAddress || !selectedNetworkInfo?.rpcUrl) {
        console.warn("User address or network RPC URL is not available.");
        return;
      }

      setLoading(true);

      const cachedTransactions = localStorage.getItem("cachedTransactions");
      if (cachedTransactions) {
        setTransactions(JSON.parse(cachedTransactions));
        setLoading(false);
        return;
      }

      const web3 = new Web3(selectedNetworkInfo.rpcUrl);
      const transferEventSignature = web3.utils.sha3(
        "Transfer(address,address,uint256)"
      );
      const options = {
        address: token.tokenAddress,
        topics: [
          transferEventSignature,
          null,
          web3.utils.padLeft(loggedInUserAddress, 64),
        ],
      };

      const logs = await fetchLogsInChunks(web3, options);

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
      localStorage.setItem(
        "cachedTransactions",
        JSON.stringify(sortedTransactions)
      );
    } catch (error) {
      console.error("Error fetching token transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAddress();
  }, []);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchTokenTransactions();
    }, 500); // Delay execution by 500ms

    return () => clearTimeout(debounceFetch);
  }, [token, loggedInUserAddress, selectedNetworkInfo]);

  const groupedTransactions = transactions.reduce((acc, tx) => {
    if (!acc[tx.date]) {
      acc[tx.date] = [];
    }
    acc[tx.date].push(tx);
    return acc;
  }, {});

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

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
              onClick={() => handleTransactionClick(tx)}
              className="flex justify-between items-center bg-gray-100 rounded-lg p-4 mb-2 shadow-md cursor-pointer hover:bg-gray-200"
            >
              <span className="text-gray-700">
                {tx.from === loggedInUserAddress ? "Sent" : "Received"}{" "}
                {tx.value} {token.tokenSymbol}
              </span>
              <span
                className={`$ {
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

      {selectedTransaction && (
        <TransactionDetailsModal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          transactionDetails={{
            status: selectedTransaction.status,
            from: selectedTransaction.from,
            to: selectedTransaction.to,
            transactionHash: selectedTransaction.transactionHash,
            explorerLink: `${blockExplorerURL}/tx/${selectedTransaction.transactionHash}`,
          }}
        />
      )}
    </div>
  );
};

export default SingleTokenActivity;
