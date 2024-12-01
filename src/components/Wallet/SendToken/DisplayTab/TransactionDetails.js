import React, { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import EditGasEstimation from "../Modal/EditGasEstimation";

const TransactionDetails = ({ transactionData }) => {
  const handleGasFee = () => {
    console.log("clicked");
    setOpen(true);
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Estimated changes */}
      <div>
        <div className="flex flex-col border-2 border-gray-300 p-3 rounded-md">
          <div className="mb-5">
            <p className="font-bold text-xl">Estimated changes</p>
          </div>
          <div className="flex flex-row items-center justify-between">
            {transactionData?.transactionDetails?.amount === 0 ? (
              <>
                <div>
                  <p className="text-gray-500 font-semibold">
                    No changes predicted for your wallet
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xl">You send</p>{" "}
                </div>
                <div className="flex items-center">
                  <p className="mr-3  px-2 py-1 rounded-xl text-red-700 bg-red-100 text-xl">
                    -{transactionData?.transactionDetails?.amount}
                  </p>
                  <p className="px-2 py-1 rounded-xl text-gray-700 bg-gray-100 text-xl">
                    {transactionData?.transactionDetails?.tokenAddress.slice(
                      0,
                      10
                    )}
                    ...$
                    {transactionData?.transactionDetails?.tokenAddress.slice(
                      -8
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Estimated fee */}

      {/* To-do */}

      <div className="mt-5">
        <div className="flex flex-col border-2 border-gray-300 p-3 rounded-md">
          <div className="mb-5">
            <div className="flex  justify-between">
              <p className="font-bold text-xl">Estimated fee</p>
              <div>
                <div>
                  <PencilIcon
                    onClick={handleGasFee}
                    className="size-5 ml-auto mb-2 text-blue-500 cursor-pointer"
                  />
                </div>
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

      <EditGasEstimation open={open} setOpen={setOpen} />
    </>
  );
};

export default TransactionDetails;
