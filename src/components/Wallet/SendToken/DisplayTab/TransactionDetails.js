import React from "react";

const TransactionDetails = () => {
  return (
    <>
      {/* Estimated changes */}
      <div>
        <div className="flex flex-col border-2 border-gray-300 p-3 rounded-md">
          <div className="mb-5">
            <p className="font-bold text-xl">Estimated changes</p>
          </div>
          <div className="flex flex-row items-center justify-between">
            <div>
              <p className="text-xl">You send</p>{" "}
            </div>
            <div className="flex items-center">
              <p className="mr-3  px-2 py-1 rounded-xl text-red-700 bg-red-100 text-xl">
                -9
              </p>
              <p className="px-2 py-1 rounded-xl text-gray-700 bg-gray-100 text-xl">
                0*28f272882
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated fee */}

      <div className="mt-5">
        <div className="flex flex-col border-2 border-gray-300 p-3 rounded-md">
          <div className="mb-5">
            <div className="flex  justify-between">
              <p className="font-bold text-xl">Estimated fee</p>
              <div>
                <p className="text-end">Edit</p>
                <p className="font-medium text-gray-400 text-lg">
                  0.00077992 SepoliaETH
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between">
            <div>
              <p className="text-xl">Advanced -60 sec</p>{" "}
            </div>
            <div className="flex items-center">
              <p className="mr-3  px-2 py-1 rounded-xl text-red-700 bg-red-100 text-xl">
                Max fee:
              </p>
              <p className="px-2 py-1 rounded-xl text-gray-700 bg-gray-100 text-xl">
                0.0018272737 SepoliaETH
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionDetails;
