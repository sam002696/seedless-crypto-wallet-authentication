import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import GasFeeList from "./GasFeeList";
import AdvancedGasFeeForm from "./AdvancedGasFeeForm";

const gasFeeData = {
  gasOptions: [
    {
      type: "Low",
      time: "60 sec",
      maxFee: "0.00108969",
      network: "SepoliaETH",
      icon: "🐢",
    },
    {
      type: "Market",
      time: "60 sec",
      maxFee: "0.00214061",
      network: "SepoliaETH",
      icon: "🦊",
    },
    {
      type: "Aggressive",
      time: "15 sec",
      maxFee: "0.00521584",
      network: "SepoliaETH",
      icon: "🐎",
    },
  ],
  networkStatus: {
    baseFee: "7 GWEI",
    priorityFee: "5 GWEI",
    status: "Stable",
  },
};

const advancedOption = {
  type: "Advanced",
  time: "15 sec",
  maxFee: "0.00193837",
  network: "SepoliaETH",
  icon: "⚙️",
};

const EditGasEstimation = ({ open, setOpen }) => {
  const [advancedGasFee, setAdvancedGasFee] = useState(false);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
            >
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {advancedGasFee ? " Advanced gas fee " : " Edit Gas Fee"}
              </h3>

              {advancedGasFee ? (
                <>
                  <AdvancedGasFeeForm setAdvancedGasFee={setAdvancedGasFee} />
                </>
              ) : (
                <>
                  <GasFeeList
                    advancedOption={advancedOption}
                    gasOptions={gasFeeData.gasOptions}
                    networkStatus={gasFeeData.networkStatus}
                    setAdvancedGasFee={setAdvancedGasFee}
                  />
                </>
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default EditGasEstimation;
