import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Asset from "./Asset";

const To = ({ setShowAsset, showAsset, assetInput, updateAssetInput }) => {
  const [originalAddress, setOriginalAddress] = useState("");
  const [displayAddress, setDisplayAddress] = useState(() => {
    return localStorage.getItem("displayAddress") || "";
  });
  const [isValid, setIsValid] = useState(() => {
    const storedValue = localStorage.getItem("isValid");
    return storedValue ? JSON.parse(storedValue) : false;
  });

  const validateAddress = (input) => {
    // Basic Ethereum address validation
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(input);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setOriginalAddress(inputValue);

    if (validateAddress(inputValue)) {
      const truncatedAddress = `${inputValue.slice(0, 10)}...${inputValue.slice(
        -8
      )}`;
      setIsValid(true);
      setDisplayAddress(truncatedAddress);

      // Save isValid and displayAddress to localStorage
      localStorage.setItem("isValid", JSON.stringify(true));
      localStorage.setItem("displayAddress", truncatedAddress);

      // Control the Asset component
      setShowAsset(true);
    } else {
      setIsValid(false);
      setDisplayAddress(inputValue);

      // Remove isValid and displayAddress from localStorage
      localStorage.removeItem("isValid");
      localStorage.removeItem("displayAddress");

      // Control the Asset component
      setShowAsset(false);
    }
  };

  const handleCancel = () => {
    setIsValid(false);
    setDisplayAddress("");

    // Remove isValid and displayAddress from localStorage
    localStorage.removeItem("isValid");
    localStorage.removeItem("displayAddress");

    // Control the Asset component
    setShowAsset(false);
    setOriginalAddress("");
  };

  useEffect(() => {
    setShowAsset(isValid);
  }, [isValid, setShowAsset]);

  return (
    <div className="col-span-full">
      <label
        htmlFor="to-address"
        className="block text-sm/6 font-medium text-gray-900"
      >
        To
      </label>
      <div className="mt-2">
        {isValid ? (
          <div className="flex items-center justify-between">
            <p className="text-gray-900">{displayAddress}</p>
            <button
              type="button"
              onClick={handleCancel}
              className="ml-4 text-sm text-indigo-600 hover:underline"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>
        ) : (
          <input
            id="to-address"
            name="to-address"
            type="text"
            autoComplete="to-address"
            placeholder="Enter public address (0x)"
            value={originalAddress}
            onChange={handleInputChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
          />
        )}
      </div>
      {!isValid && originalAddress && (
        <p className="mt-2 text-sm text-red-600">Invalid public address.</p>
      )}
      {showAsset && (
        <Asset
          showDownIcon={false}
          makeAssetsDisable={true}
          assetInput={assetInput}
          updateAssetInput={updateAssetInput}
          showAdditonalInfo={true}
        />
      )}
    </div>
  );
};

export default To;
