import React, { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectNetwork } from "../reducers/networkSlice";

const AssetContext = createContext();

export const useAsset = () => useContext(AssetContext);

// state to handle clear and max value when token changes - to do

export const AssetProvider = ({ children }) => {
  const selectedNetworkInfo = useSelector(selectNetwork);

  const [assetBalanceMessage, setAssetBalanceMessage] = useState("");

  const [selectedAsset, setSelectedAsset] = useState({
    balance: null,
    tokenAddress: null,
    tokenBalance: null,
    tokenChainId: null,
    tokenChainIdHex: null,
    tokenDecimals: null,
    tokenNetworkId: null,
    tokenSymbol: null,
  });

  useEffect(() => {
    if (selectedNetworkInfo) {
      setSelectedAsset({
        balance: selectedNetworkInfo.balance,
        tokenAddress: null,
        tokenBalance: null,
        tokenChainId: selectedNetworkInfo.chainId,
        tokenChainIdHex: selectedNetworkInfo.hex,
        tokenDecimals: 18,
        tokenNetworkId: selectedNetworkInfo.networkId,
        tokenSymbol: selectedNetworkInfo.ticker,
      });
    }
  }, [selectedNetworkInfo]);

  // Function to select a new asset
  const selectAsset = (asset) => {
    setSelectedAsset(asset);
  };

  return (
    <AssetContext.Provider
      value={{
        selectedAsset,
        selectAsset,
        setAssetBalanceMessage,
        assetBalanceMessage,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};
