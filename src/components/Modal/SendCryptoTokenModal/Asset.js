import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useAssetList } from "../../../context/AssetListContext";
import { useAsset } from "../../../context/AssetContext";

const Asset = ({
  assetInput,
  updateAssetInput,
  showDownIcon,
  makeAssetsDisable,
}) => {
  const [showClear, setShowClear] = useState(false);
  const { selectedAsset } = useAsset();
  const { setShowAssetList } = useAssetList();

  const handleAssetList = () => {
    setShowAssetList(true);
  };

  const handleChange = (e) => {
    updateAssetInput(e.target.value);
  };

  const handleMaxValue = () => {
    updateAssetInput(selectedAsset?.balance);
    setShowClear(true);
  };

  const handleClearValue = () => {
    updateAssetInput("");
    setShowClear(false);
  };

  console.log("selectedAsset", selectedAsset);

  return (
    <>
      <div className="mt-3">
        <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-gray-50">
          {/* Network Name */}
          <div className="flex flex-row justify-evenly items-center">
            <button
              disabled={makeAssetsDisable}
              className="text-gray-900 font-medium text-xs disabled:cursor-not-allowed"
            >
              {selectedAsset?.tokenSymbol}
            </button>
            {showDownIcon && (
              <ChevronDownIcon
                onClick={handleAssetList}
                className="size-4 ml-1 cursor-pointer"
              />
            )}
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={assetInput}
            onChange={handleChange}
            placeholder="Enter value"
            className="w-1/2 p-2 border rounded-md text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
          />
        </div>
        <div className="mt-2 mx-1 flex justify-between items-center">
          <p className=" text-xs text-gray-500">
            Balance : {selectedAsset?.balance}
          </p>
          {showClear ? (
            <button
              onClick={handleClearValue}
              className="text-xs text-blue-400"
            >
              Clear
            </button>
          ) : (
            <button onClick={handleMaxValue} className="text-xs text-blue-400">
              Max
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Asset;
