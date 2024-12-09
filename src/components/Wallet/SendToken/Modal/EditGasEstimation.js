import React, { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axios from "axios";
import GasFeeList from "./GasFeeList";
import AdvancedGasFeeForm from "./AdvancedGasFeeForm";

const EditGasEstimation = ({
  open,
  setOpen,
  transactionData,
  setGasOptions,
  gasOptions,
  setSelectedGasFee,
  selectedGasFee,
}) => {
  const [networkStatus, setNetworkStatus] = useState({});
  const [advancedGasFee, setAdvancedGasFee] = useState(false);
  const [animation, setAnimation] = useState(false);

  const fetchGasFees = async () => {
    if (!transactionData?.network.chainId) return;

    setAnimation(true);
    try {
      const response = await axios.get(
        `https://gas.api.infura.io/v3/75573f1a11f84a848d4e7292fe2fb5b9/networks/${transactionData.network.chainId}/suggestedGasFees`
      );

      const data = response.data;

      const options = [
        {
          type: "Low",
          time: `${data.low.minWaitTimeEstimate / 1000} - ${
            data.low.maxWaitTimeEstimate / 1000
          } sec`,
          maxFee: `${((parseFloat(data.low.suggestedMaxFeePerGas) / 1e9) * 1.05) // Increase by 5%
            .toFixed(8)} ${transactionData?.network.nativeCurrency || "ETH"}`,
          priorityFee: `${(
            parseFloat(data.low.suggestedMaxPriorityFeePerGas) / 1e9
          ).toFixed(8)} ${transactionData?.network.nativeCurrency || "ETH"}`,
          network: transactionData?.network.name,
          icon: "🐢",
        },
        {
          type: "Market",
          time: `${data.medium.minWaitTimeEstimate / 1000} - ${
            data.medium.maxWaitTimeEstimate / 1000
          } sec`,
          maxFee: `${(
            (parseFloat(data.medium.suggestedMaxFeePerGas) / 1e9) *
            1.05
          ) // Increase by 5%
            .toFixed(8)} ${transactionData?.network.nativeCurrency || "ETH"}`,
          priorityFee: `${(
            parseFloat(data.medium.suggestedMaxPriorityFeePerGas) / 1e9
          ).toFixed(8)} ${transactionData?.network.nativeCurrency || "ETH"}`,
          network: transactionData?.network.name,
          icon: "🦊",
        },
        {
          type: "Aggressive",
          time: `${data.high.minWaitTimeEstimate / 1000} - ${
            data.high.maxWaitTimeEstimate / 1000
          } sec`,
          maxFee: `${(
            (parseFloat(data.high.suggestedMaxFeePerGas) / 1e9) *
            1.05
          ) // Increase by 5%
            .toFixed(8)} ${transactionData?.network.nativeCurrency || "ETH"}`,
          priorityFee: `${(
            parseFloat(data.high.suggestedMaxPriorityFeePerGas) / 1e9
          ).toFixed(8)} ${transactionData?.network.nativeCurrency || "ETH"}`,
          network: transactionData?.network.name,
          icon: "🐎",
        },
      ];

      setGasOptions(options);

      setNetworkStatus({
        baseFee: `${data.estimatedBaseFee} GWEI`,
        congestion: `${(data.networkCongestion * 100).toFixed(1)}%`,
        status: data.priorityFeeTrend === "down" ? "Stable" : "Increasing",
      });
    } catch (error) {
      console.error("Error fetching gas fee data:", error);
    } finally {
      setTimeout(() => setAnimation(false), 3000); // Stop animation regardless of success or failure
    }
  };

  useEffect(() => {
    // Only fetch when the modal is open

    fetchGasFees(); // Fetch immediately on open

    const intervalId = setInterval(() => {
      fetchGasFees();
    }, 1200000); // Fetch every 12 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount or close
  }, [transactionData]);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-10"
      >
        {/* Dialog Backdrop and Panel */}
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {advancedGasFee ? "Advanced gas fee" : "Edit Gas Fee"}
              </h3>

              {advancedGasFee ? (
                <AdvancedGasFeeForm setAdvancedGasFee={setAdvancedGasFee} />
              ) : (
                <GasFeeList
                  advancedOption={{
                    type: "Advanced",
                    time: "15 sec",
                    maxFee: "Dynamic value",
                    network: "Dynamic network",
                    icon: "⚙️",
                  }}
                  gasOptions={gasOptions}
                  networkStatus={networkStatus}
                  setAdvancedGasFee={setAdvancedGasFee}
                  setSelectedGasFee={setSelectedGasFee}
                  selectedGasFee={selectedGasFee}
                  setOpen={setOpen}
                  animation={animation}
                />
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default EditGasEstimation;
