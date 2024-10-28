import React from "react";
import WalletInfo from "./WalletInfo/WalletInfo";
import WalletTransaction from "./WalletTransaction/WalletTransaction";
import WalletActivity from "./WalletActivity/WalletActivity";
import ArisPayLogo from "../../images/logo/arispay_logo.png";

const WalletHome = () => {
  return (
    <>
      <div className="bg-gray-100">
        <div className=" flex flex-row items-center justify-center">
          <img alt="ARISPAY Wallet" src={ArisPayLogo} className="h-20 w-20" />
          <h2 className="text-center text-xl font-bold leading-9 tracking-tight text-gray-600">
            ARISPAY CRYPTO WALLET
          </h2>
        </div>
        <div className=" min-h-screen flex items-center justify-center">
          <div className="bg-white w-full max-w-5xl shadow-lg">
            <WalletInfo />
            <WalletTransaction />
            <WalletActivity />
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletHome;
