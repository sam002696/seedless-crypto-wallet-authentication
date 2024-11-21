import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useAssetList } from "../../../context/AssetListContext";
import { useAsset } from "../../../context/AssetContext";

const Asset = ({
  assetInput,
  updateAssetInput,
  showDownIcon,
  makeAssetsDisable,
  showAdditonalInfo,
}) => {
  const [showClear, setShowClear] = useState(false);
  const [showBalanceMessage, setShowBalanceMessage] = useState("");
  const { selectedAsset, setAssetBalanceMessage } = useAsset();
  const { setShowAssetList } = useAssetList();

  // function to show all the assets in
  // one place (e.g. SendFromTo.js)
  const handleAssetList = () => {
    setShowAssetList(true);
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Updating the parent component with the new input value
    updateAssetInput(inputValue);

    // Determining the appropriate balance message based on asset type and balance
    const isBalanceSufficient = inputValue <= selectedAsset.balance;
    const insufficientMessage =
      selectedAsset.tokenBalance !== null
        ? "Insufficient tokens"
        : "Insufficient funds";

    // Seting the balance messages based on sufficiency
    const balanceMessage = isBalanceSufficient ? "" : insufficientMessage;
    setShowBalanceMessage(balanceMessage);
    setAssetBalanceMessage(balanceMessage);
  };

  const handleMaxValue = () => {
    // setting max value of the token in
    // parent component (e.g. SendFromTo.js)
    updateAssetInput(selectedAsset?.balance);

    // clicking on Max value
    // show Clear button
    setShowClear(true);

    setShowBalanceMessage("");
    setAssetBalanceMessage("");
  };

  const handleClearValue = () => {
    // clear parent component's input value
    //  parent component (e.g. SendFromTo.js)
    updateAssetInput("");

    // makes the Max button
    // appear again
    setShowClear(false);

    // clears balance message(if any)
    setShowBalanceMessage("");
  };

  // Clicking on different token
  // clears previous input value of user (if any)
  //  parent component (e.g. SendFromTo.js)
  useEffect(() => {
    updateAssetInput("");
    setAssetBalanceMessage("");
  }, [selectedAsset?.tokenSymbol]);

  // console.log("selectedAsset", selectedAsset);

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
            placeholder=""
            className="w-1/2 p-2 border rounded-md text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs text-end"
          />
        </div>
        <div
          className={`mt-2 mx-1 flex justify-between items-center ${
            showAdditonalInfo && "hidden"
          }`}
        >
          <p className=" text-xs text-gray-500">
            Balance : {selectedAsset?.balance}{" "}
            <span className="text-red-500 font-semibold">
              {showBalanceMessage}
            </span>
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
