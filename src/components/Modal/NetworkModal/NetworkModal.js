import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { loadNetwork, selectNetwork } from "../../../reducers/networkSlice";
import { Network } from "../../../helpers/Network";

const rpcNetworks = [
  {
    hex: "0x1",
    name: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/75573f1a11f84a848d4e7292fe2fb5b9",
    ticker: "ETH",
  },
  {
    hex: "0xaa36a7",
    name: "Ethereum Sepolia",
    rpcUrl: "https://sepolia.infura.io/v3/75573f1a11f84a848d4e7292fe2fb5b9",
    ticker: "SepoliaETH",
  },
  {
    hex: "0x1234",
    name: "Linea Mainnet",
    rpcUrl:
      "https://linea-mainnet.infura.io/v3/75573f1a11f84a848d4e7292fe2fb5b9",
    ticker: "LineaETH",
  },
  {
    hex: "0x5678",
    name: "Linea Sepolia",
    rpcUrl:
      "https://linea-sepolia.infura.io/v3/75573f1a11f84a848d4e7292fe2fb5b9",
    ticker: "LineaSepoliaETH",
  },
];

const NetworkModal = ({
  open,
  setOpen,
  selectedNetwork,
  setSelectedNetwork,
}) => {
  const selectedNetworkInfo = useSelector(selectNetwork);
  const dispatch = useDispatch();

  const handleNetworkSelect = (network) => {
    setSelectedNetwork(network);
    setOpen(false);
    Network.saveNetwork(network);
    dispatch(loadNetwork({ rpcUrl: network.rpcUrl, ticker: network.ticker }));
  };

  console.log("selectedNetworkInfo", selectedNetworkInfo);

  console.log("Network", Network.getNetworkRpcUrl());

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900"
                >
                  Select a network
                </DialogTitle>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <div className="mt-4 px-3">
                <p className="mt-4 text-sm font-medium text-gray-700">
                  Enabled Networks
                </p>

                {/* Map through rpcNetworks JSON */}
                <div className="mt-4 space-y-2">
                  {rpcNetworks.map((network) => (
                    <div
                      key={network.hex}
                      onClick={() => handleNetworkSelect(network)}
                      className={`flex items-center justify-between p-3 rounded-md shadow-sm cursor-pointer ${
                        selectedNetwork.hex === network.hex
                          ? "bg-blue-200"
                          : "bg-gray-100"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {network.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Chain ID: {network.hex}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center bg-blue-50 mt-6 py-2 rounded-full">
                  <button
                    type="button"
                    className="text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-100"
                  >
                    + Add a network
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default NetworkModal;
