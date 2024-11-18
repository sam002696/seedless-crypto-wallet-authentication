import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import AssetList from "./AssetList";
import { useAssetList } from "../../../context/AssetListContext";

const Asset = () => {
  const { setShowAssetList } = useAssetList();

  const handleAssetList = () => {
    setShowAssetList(true);
  };

  return (
    <>
      <div className="mt-3">
        <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-gray-50">
          {/* Network Name */}
          <div className="flex flex-row justify-evenly items-center">
            <button
              onClick={handleAssetList}
              className="text-gray-900 font-medium text-xs"
            >
              Network Name
            </button>
            <ChevronDownIcon className="size-4 ml-1" />
          </div>

          {/* Input Field */}
          <input
            type="text"
            placeholder="Enter value"
            className="w-1/2 p-2 border rounded-md text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
          />
        </div>
      </div>
    </>
  );
};

export default Asset;
