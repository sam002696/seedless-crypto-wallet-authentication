import React from "react";
import WalletInfo from "../WalletInfo/WalletInfo";
import ArisPayLogo from "../../../images/logo/arispay_logo.png";
import SendToken from "./SendToken";

const SendTokenHome = () => {
  return (
    <>
      <div className="bg-gray-100">
        <div className=" flex flex-row items-center justify-center">
          <img alt="ARISPAY Wallet" src={ArisPayLogo} className="h-20 w-20" />
          <h2 className="text-center text-xl font-bold leading-9 tracking-tight text-gray-600">
            ARISPAY WALLET
          </h2>
        </div>
        <div className=" min-h-screen flex flex-col items-center justify-center">
          <div className="bg-white w-full max-w-4xl shadow-lg">
            <WalletInfo />
          </div>
          <div className="bg-white w-full max-w-2xl shadow-lg mt-5">
            <SendToken />
          </div>
        </div>
      </div>
    </>
  );
};

export default SendTokenHome;
