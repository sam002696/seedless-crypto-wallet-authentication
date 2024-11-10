/* eslint-disable no-undef */
import React, { useState } from "react";
import FetchTokenBalanceImport from "./FetchTokenBalanceImport";
import FetchTokenSymbolNext from "./FetchTokenSymbolNext";

const CustomToken = ({ setOpen }) => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState(null);
  const [tokenDecimals, setTokenDecimals] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null); // New state for token balance
  const [errorMessage, setErrorMessage] = useState(null);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isNextButtonClicked, setIsNextButtonClicked] = useState(false);

  console.log("tokenDecimals", tokenDecimals);
  console.log("tokenBalance", tokenBalance);

  return (
    <>
      {isNextButtonClicked ? (
        <>
          <FetchTokenBalanceImport
            tokenAddress={tokenAddress}
            tokenSymbol={tokenSymbol}
            tokenDecimals={tokenDecimals}
            tokenBalance={tokenBalance}
            setTokenBalance={setTokenBalance}
            setErrorMessage={setErrorMessage}
            setIsNextButtonClicked={setIsNextButtonClicked}
            setOpen={setOpen}
          />
        </>
      ) : (
        <>
          <FetchTokenSymbolNext
            tokenAddress={tokenAddress}
            setTokenAddress={setTokenAddress}
            tokenSymbol={tokenSymbol}
            setTokenSymbol={setTokenSymbol}
            tokenDecimals={tokenDecimals}
            setTokenDecimals={setTokenDecimals}
            setTokenBalance={setTokenBalance}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            isButtonEnabled={isButtonEnabled}
            setIsButtonEnabled={setIsButtonEnabled}
            setIsNextButtonClicked={setIsNextButtonClicked}
          />
        </>
      )}
    </>
  );
};

export default CustomToken;
