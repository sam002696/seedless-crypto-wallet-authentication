import React from "react";
// import { Link } from "react-router-dom";
import { useTokenView } from "../../../../context/TokenViewContext";

const TokenList = () => {
  const { setIsTokenView } = useTokenView();
  const tokens = [
    { name: "SepoliaETH", balance: "0.086 SepoliaETH" },
    { name: "ARISPAY", balance: "140 ARISPAY" },
  ];

  return (
    <div className="p-4">
      {tokens.map((token, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-gray-100 rounded-lg p-4 mb-2 shadow-md cursor-pointer"
          onClick={() => setIsTokenView(true)}
        >
          <span className="text-lg font-semibold">{token.name}</span>
          <span className="text-gray-700">{token.balance}</span>
        </div>
      ))}
    </div>
  );
};

export default TokenList;
