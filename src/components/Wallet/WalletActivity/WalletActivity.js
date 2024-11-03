import React, { useState } from "react";

import WalletNFT from "./WalletNFT";
import WalletToken from "./WalletToken/WalletToken";

const WalletActivity = () => {
  const walletActivityInfo = ["Tokens", "NFTs", "Activity"];
  const [walletActivity, setwalletActivity] = useState("Tokens");

  const displayTabContent = () => {
    switch (walletActivity) {
      case "Tokens":
        return <WalletToken />;
      case "NFTs":
        return <WalletNFT />;
      case "Activity":

      // eslint-disable-next-line no-fallthrough
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen ">
      {/* Tabs Display Start */}
      <div className="flex flex-row justify-between mt-5">
        {walletActivityInfo.map((item) => (
          <button
            key={item}
            className={`flex-1 py-3 text-center font-bold text-base ${
              walletActivity === item
                ? "border-b-4 border-blue-500 text-blue-500"
                : "border-b-4 border-gray-300 text-gray-400"
            }`}
            onClick={() => setwalletActivity(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="mt-4 px-3">{displayTabContent()}</div>
    </div>
  );
};

export default WalletActivity;
