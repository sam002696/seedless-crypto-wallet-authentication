import React from "react";

const AssetList = () => {
  const assets = [
    { type: "native", name: "SepoliaETH", balance: "0.5321" },
    { type: "token", name: "USDT", balance: "120.34" },
    { type: "token", name: "DAI", balance: "98.12" },
    { type: "token", name: "WBTC", balance: "0.0032" },
  ];

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm mt-4">
      <h2 className="text-xs font-semibold text-gray-900 mb-4">Tokens</h2>

      <ul className="space-y-2">
        {assets.map((asset, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-3 border rounded-md bg-white"
          >
            <span className="font-medium text-gray-700 text-xs">
              {asset.name}
            </span>
            <span className="text-gray-900 font-semibold text-xs">
              {asset.balance} {asset.type === "native" ? "ETH" : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetList;
