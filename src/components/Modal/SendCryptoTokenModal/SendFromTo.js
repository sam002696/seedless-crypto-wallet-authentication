import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { AuthUser } from "../../../helpers/AuthUser";
import From from "./From";
import To from "./To";
import AssetList from "./AssetList";
import { useAssetList } from "../../../context/AssetListContext";

const userAddress = AuthUser?.getLoggedInUserAddress() || "0x000000";

const truncatedAddress = `${userAddress.slice(0, 7)}...${userAddress.slice(
  -5
)}`;

const userAccounts = [
  {
    accountName: "Account 1",
    publicAddress: userAddress,
    truncatedAddress: truncatedAddress,
    Balance: "0.00",
    ticker: "SepoliaETH",
  },
  {
    accountName: "Account 2",
    publicAddress: userAddress,
    truncatedAddress: truncatedAddress,
    Balance: "0.00",
    ticker: "SepoliaETH",
  },
];

const SendFromTo = ({ openCryptoTokenSend, setOpenCryptoTokenSend }) => {
  const { showAssetList } = useAssetList();
  const [selectedAccount, setSelectedAccount] = useState(userAccounts[0]);

  const [isOpen, setIsOpen] = useState(false);
  const [showAsset, setShowAsset] = useState(false);

  const [assetInput, setAssetInput] = useState(() => {
    return localStorage.getItem("assetInput") || "";
  });

  const updateAssetInput = (value) => {
    setAssetInput(value);
    localStorage.setItem("assetInput", value);
  };

  return (
    <>
      <Dialog
        open={openCryptoTokenSend}
        onClose={setOpenCryptoTokenSend}
        className="relative z-10"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    {showAssetList ? "Select asset to send" : "SEND"}
                  </DialogTitle>
                </div>

                {showAssetList ? (
                  <>
                    <AssetList />
                  </>
                ) : (
                  <>
                    <div className="space-y-12">
                      <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                          <From
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            userAccounts={userAccounts}
                            setSelectedAccount={setSelectedAccount}
                            selectedAccount={selectedAccount}
                            showAsset={showAsset}
                            assetInput={assetInput}
                            updateAssetInput={updateAssetInput}
                          />

                          <To
                            setShowAsset={setShowAsset}
                            showAsset={showAsset}
                            assetInput={assetInput}
                            updateAssetInput={updateAssetInput}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button
                        type="button"
                        className="text-sm/6 font-semibold text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Continue
                      </button>
                    </div>
                  </>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default SendFromTo;
