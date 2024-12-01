import React from "react";

const GasFeeList = ({
  gasOptions,
  setAdvancedGasFee,
  advancedOption,
  networkStatus,
}) => {
  const handleAdvancedGasFee = () => {
    setAdvancedGasFee(true);
  };
  return (
    <div>
      <div className="mt-4 space-y-4">
        {gasOptions.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span className="mr-2 text-xl">{option.icon}</span>
              <div>
                <p className="text-sm font-medium">{option.type}</p>
                <p className="text-xs text-gray-500">{option.time}</p>
              </div>
            </div>
            <div>
              <p className="text-sm">{option.maxFee}</p>
              {/* <p className="text-xs text-gray-500">{option.network}</p> */}
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Option */}
      <div className="mt-6">
        <hr className="border-t border-gray-400 py-2"></hr>
        <div
          onClick={handleAdvancedGasFee}
          className="mt-2 flex items-center justify-between p-3 border rounded-lg hover:bg-gray-100 cursor-pointer"
        >
          <div className="flex items-center ">
            <span className="mr-2 text-xl">{advancedOption.icon}</span>
            <div>
              <p className="text-sm font-medium">{advancedOption.type}</p>
              <p className="text-xs text-gray-500">{advancedOption.time}</p>
            </div>
          </div>
          <div>
            <p className="text-sm">{advancedOption.maxFee}</p>
            <p className="text-xs text-gray-500">{advancedOption.network}</p>
          </div>
        </div>
      </div>

      {/* Network Status */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm">
        <p>Base Fee: {networkStatus.baseFee}</p>
        <p>Congestion: {networkStatus.congestion}</p>
        <p>
          Status: <span className="font-semibold">{networkStatus.status}</span>
        </p>
      </div>
    </div>
  );
};

export default GasFeeList;
