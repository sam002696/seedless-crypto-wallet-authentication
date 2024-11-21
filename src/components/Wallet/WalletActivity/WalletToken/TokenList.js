import React from "react";
import { useTokenView } from "../../../../context/TokenViewContext";
import { useSelector } from "react-redux";
import { selectNetwork } from "../../../../reducers/networkSlice";

const TokenList = () => {
  const { setIsTokenView, setSelectedToken } = useTokenView();
  const selectedNetworkInfo = useSelector(selectNetwork);

  console.log("selectedNetworkInfo", selectedNetworkInfo);

  const showIndividualTokenDetails = (singleToken) => {
    setSelectedToken(singleToken); // Set the selected token in context
    setIsTokenView(true); // Trigger view change
    console.log("selectedNetworkInfo", selectedNetworkInfo);
  };

  return (
    <div className="p-4">
      {selectedNetworkInfo?.token.map((singleToken, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-gray-100 rounded-lg p-4 mb-2 shadow-md cursor-pointer"
          onClick={() => showIndividualTokenDetails(singleToken)}
        >
          <span className="text-lg font-semibold">
            {singleToken.tokenSymbol}
          </span>
          <span className="text-gray-700">
            {/* {tokenBalances[token.tokenSymbol] ?? "Loading..."} */}
            {singleToken.balance}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TokenList;
