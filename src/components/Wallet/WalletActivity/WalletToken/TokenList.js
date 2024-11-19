import React from "react";
import { useTokenView } from "../../../../context/TokenViewContext";
import { useSelector } from "react-redux";
import { selectNetwork } from "../../../../reducers/networkSlice";

const TokenList = () => {
  const { setIsTokenView } = useTokenView();
  const selectedNetworkInfo = useSelector(selectNetwork);

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
            {/* {tokenBalances[token.tokenSymbol] ?? "Loading..."} */}
            {token.balance}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TokenList;
