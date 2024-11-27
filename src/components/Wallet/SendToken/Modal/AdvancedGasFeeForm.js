import React, { useState } from "react";

const AdvancedGasFeeForm = ({ setAdvancedGasFee }) => {
  const [baseFee, setBaseFee] = useState(25);
  const [priorityFee, setPriorityFee] = useState(1.5);
  const [gasLimit, setGasLimit] = useState(77535);
  const [saveDefault, setSaveDefault] = useState(true);

  const handleGoBack = () => {
    setAdvancedGasFee(false);
  };

  return (
    <div className="mt-10">
      <div className=""></div>

      {/* Max Base Fee */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-700">
          Max base fee (GWEI)
        </label>
        <div className="flex items-center mt-1">
          <input
            type="number"
            value={baseFee}
            onChange={(e) => setBaseFee(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          />
          <span className="ml-3 text-gray-500 text-xs">
            ≈ {(baseFee * 0.000077).toFixed(6)} SepoliaETH
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Current: 12.03 GWEI</span>
          <span>12hr: 7.89 - 23.88 GWEI</span>
        </div>
      </div>

      {/* Priority Fee */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-700">
          Priority Fee (GWEI)
        </label>
        <div className="flex items-center mt-1">
          <input
            type="number"
            value={priorityFee}
            onChange={(e) => setPriorityFee(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          />
          <span className="ml-3 text-gray-500 text-xs">
            ≈ {(priorityFee * 0.000077).toFixed(6)} SepoliaETH
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Current: 0 - 2.71 GWEI</span>
          <span>12hr: 0 - 15 GWEI</span>
        </div>
      </div>

      {/* Gas Limit */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-700">
          Gas limit
        </label>
        <input
          type="number"
          value={gasLimit}
          onChange={(e) => setGasLimit(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none mt-1"
        />
      </div>

      {/* Save Default Checkbox */}
      <div className="mb-6 flex items-center">
        <input
          type="checkbox"
          checked={saveDefault}
          onChange={(e) => setSaveDefault(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-300 rounded border-gray-300"
        />
        <label className="ml-2 text-xs text-gray-700">
          Save these values as my default for the Sepolia network.
        </label>
      </div>

      {/* Save Button */}
      <div className="flex flex-row items-center">
        <button
          onClick={handleGoBack}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 mr-5"
        >
          Go back
        </button>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
          Save
        </button>
      </div>
    </div>
  );
};

export default AdvancedGasFeeForm;
