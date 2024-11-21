import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useAssetList } from "../../../context/AssetListContext";
import { useSelector } from "react-redux";
import { selectNetwork } from "../../../reducers/networkSlice";
import { useAsset } from "../../../context/AssetContext";

const AssetList = () => {
  const { setShowAssetList } = useAssetList();
  const selectedNetworkInfo = useSelector(selectNetwork);
  const { selectedAsset, selectAsset } = useAsset();

  // console.log("selectedNetworkInfo", selectedNetworkInfo);

  // handles the key, pair value of the asset
  const handleTokenAsset = (asset) => {
    const defaultAsset = {
      balance: asset.balance,
      tokenAddress: asset.tokenAddress,
      tokenBalance: asset.tokenBalance,
      tokenChainId: asset.tokenChainId,
      tokenChainIdHex: asset.tokenChainIdHex,
      tokenDecimals: asset.tokenDecimals,
      tokenNetworkId: asset.tokenNetworkId,
      tokenSymbol: asset.tokenSymbol,
    };
    selectAsset(defaultAsset);
    setShowAssetList(false);
  };

  // handles the key, pair value of the asset
  const handleNativeNetworkInfo = () => {
    const defaultAsset = {
      balance: selectedNetworkInfo.balance,
      tokenAddress: selectedNetworkInfo.account,
      tokenBalance: null,
      tokenChainId: selectedNetworkInfo.chainId,
      tokenChainIdHex: selectedNetworkInfo.hex,
      tokenDecimals: null,
      tokenNetworkId: selectedNetworkInfo.networkId,
      tokenSymbol: selectedNetworkInfo.ticker,
    };
    selectAsset(defaultAsset);
    setShowAssetList(false);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm mt-4">
      <div className=" flex flex-row justify-between items-center my-4">
        <h2 className="text-xs font-semibold text-gray-900 ">Tokens</h2>
        <XMarkIcon
          onClick={() => setShowAssetList(false)}
          className=" size-4 cursor-pointer"
        />
      </div>

      {/* Native balance */}

      <div className="my-2.5">
        <div
          onClick={handleNativeNetworkInfo}
          className={`flex justify-between items-center p-3 border rounded-md  cursor-pointer ${
            selectedAsset.tokenSymbol === selectedNetworkInfo.ticker
              ? "bg-blue-300"
              : "bg-white"
          }`}
        >
          <span className="font-medium text-gray-700 text-xs">
            {selectedNetworkInfo.ticker}
          </span>
          <span className="text-gray-900 font-semibold text-xs">
            {selectedNetworkInfo.balance} {selectedNetworkInfo.ticker}
          </span>
        </div>
      </div>

      {/* Tokens list */}
      <ul className="space-y-2">
        {selectedNetworkInfo?.token.map((asset, index) => (
          <div
            onClick={() => handleTokenAsset(asset)}
            key={index}
            className={`flex justify-between items-center p-3 border rounded-md cursor-pointer ${
              selectedAsset.tokenSymbol === asset.tokenSymbol
                ? "bg-blue-300"
                : "bg-white"
            }`}
          >
            <span className="font-medium text-gray-700 text-xs">
              {asset.tokenSymbol}
            </span>
            <span className="text-gray-900 font-semibold text-xs">
              {asset.balance} {asset.tokenSymbol}
              {/* {asset.type === "native" ? "ETH" : ""} */}
            </span>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default AssetList;
