import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

const rpcNetworks = [
  {
    name: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    chainId: 1,
  },
  {
    name: "Sepolia Testnet",
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    chainId: 11155111,
  },
  {
    name: "Polygon Mainnet",
    rpcUrl: "https://polygon-rpc.com",
    chainId: 137,
  },
  {
    name: "Binance Smart Chain",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    chainId: 56,
  },
];

const NetworkModal = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
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
                <div className="mt-2">
                  <div className="mt-2">
                    <input
                      id="token_contract_address"
                      name="token_contract_address"
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder="Network"
                    />
                  </div>

                  <p className="mt-4 text-sm font-medium text-gray-700">
                    Enabled Networks
                  </p>

                  {/* Map through rpcNetworks JSON */}
                  <div className="mt-4 space-y-2">
                    {rpcNetworks.map((network) => (
                      <div
                        key={network.chainId}
                        className="flex items-center justify-between p-3 bg-gray-100 rounded-md shadow-sm"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {network.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Chain ID: {network.chainId}
                          </p>
                          {/* <p className="text-sm text-gray-500 truncate">
                            RPC URL: {network.rpcUrl}
                          </p> */}
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
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default NetworkModal;
