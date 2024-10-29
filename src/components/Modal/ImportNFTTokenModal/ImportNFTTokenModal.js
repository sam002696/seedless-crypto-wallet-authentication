import React from "react";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const ImportNFTTokenModal = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex  items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900"
                >
                  Import Tokens
                </DialogTitle>
                <div className="mt-2">
                  <div className="rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-yellow-400"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          NFT autodetection
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            To use Opensea to see your NFTs, turn on 'Display
                            NFT Media' in Settings Security and privacy.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              {/* Content Area */}
              <div className="mt-4 px-3">
                <div className="mt-2">
                  <label
                    htmlFor="token_contract_address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Token contract address
                  </label>
                  <div className="mt-2">
                    <input
                      id="token_contract_address"
                      name="token_contract_address"
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <label
                    htmlFor="token_contract_address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Token ID
                  </label>
                  <div className="mt-2">
                    <input
                      id="token_contract_address"
                      name="token_contract_address"
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="text-center bg-blue-50 mt-20 py-2 rounded-full ">
                    <button
                      type="button"
                      className="text-lg font-medium text-blue-600 shadow-sm hover:bg-blue-100"
                    >
                      Next
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

export default ImportNFTTokenModal;
