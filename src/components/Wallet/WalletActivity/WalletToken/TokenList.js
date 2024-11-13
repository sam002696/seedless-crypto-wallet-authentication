import React, { useState, useEffect } from "react";
import { useTokenView } from "../../../../context/TokenViewContext";
import { useSelector } from "react-redux";
import { selectNetwork } from "../../../../reducers/networkSlice";
import { getTokenBalance } from "../../../../utilities/getTokenBalance";
import Web3 from "web3";
import { AuthUser } from "../../../../helpers/AuthUser";

const TokenList = () => {
  const { setIsTokenView } = useTokenView();
  const selectedNetworkInfo = useSelector(selectNetwork);
  const [tokenBalances, setTokenBalances] = useState({});

  useEffect(() => {
    const fetchBalances = async () => {
      const web3 = new Web3(Web3.givenProvider || selectedNetworkInfo?.rpcUrl);
      if (selectedNetworkInfo?.token) {
        const balances = {};

        for (const token of selectedNetworkInfo.token) {
          const balance = await getTokenBalance(
            web3,
            token?.tokenAddress,
            AuthUser.getPublicKey(),
            token?.tokenDecimals
          );
          balances[token.tokenSymbol] = balance;
        }

        setTokenBalances(balances);
      }
    };

    fetchBalances();
  }, [selectedNetworkInfo]);

  return (
    <div className="p-4">
      {selectedNetworkInfo?.token.map((token, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-gray-100 rounded-lg p-4 mb-2 shadow-md cursor-pointer"
          onClick={() => setIsTokenView(true)}
        >
          <span className="text-lg font-semibold">{token.tokenSymbol}</span>
          <span className="text-gray-700">
            {tokenBalances[token.tokenSymbol] ?? "Loading..."}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TokenList;
