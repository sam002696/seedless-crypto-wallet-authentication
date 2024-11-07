import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import SearchToken from "../../Wallet/ImportToken/SearchToken/SearchToken";
import CustomToken from "../../Wallet/ImportToken/CustomToken/CustomToken";

const ImportTokenModal = ({ open, setOpen }) => {
  const tokenSearch = ["Search", "Custom token"];
  const [tokenSearchInfo, setTokenSearchInfo] = useState("Search");

  const displayTabContent = () => {
    switch (tokenSearchInfo) {
      case "Search":
        return <SearchToken />;
      case "Custom token":
        return <CustomToken setOpen={setOpen} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
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
                  Import Tokens
                </DialogTitle>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <div className="flex flex-row justify-between mt-5">
                {tokenSearch.map((item) => (
                  <button
                    key={item}
                    className={`flex-1 py-3 text-center font-bold text-base ${
                      tokenSearchInfo === item
                        ? "border-b-4 border-blue-500 text-blue-500"
                        : "border-b-4 border-gray-300 text-gray-400"
                    }`}
                    onClick={() => setTokenSearchInfo(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="mt-4 px-3">{displayTabContent()}</div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ImportTokenModal;
