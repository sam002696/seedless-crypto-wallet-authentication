import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { AuthUser } from "../../../helpers/AuthUser";

const userAddress = AuthUser?.getLoggedInUserAddress() || "0x000000"; // Default fallback

// Truncate address (first 7 and last 5 characters)
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

const SendCryptoTokenModal = ({
  openCryptoTokenSend,
  setOpenCryptoTokenSend,
}) => {
  const [selectedAccount, setSelectedAccount] = useState(userAccounts[0]);

  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (account) => {
    handleAccountSelect(account);
    setIsOpen(false);
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  return (
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
                  SEND
                </DialogTitle>
              </div>
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="relative col-span-full">
                      <label
                        htmlFor="account"
                        className="block text-sm font-medium text-gray-900"
                      >
                        From
                      </label>
                      <button
                        id="account"
                        onClick={handleDropdownToggle}
                        className="w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm flex justify-between items-center"
                      >
                        <div className="text-start">
                          <p className="font-medium">
                            {selectedAccount
                              ? selectedAccount.accountName
                              : "Choose a account"}
                          </p>
                          <p className="text-md text-gray-500 ">
                            {selectedAccount
                              ? selectedAccount.truncatedAddress
                              : ""}
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {isOpen && (
                        <div className="absolute mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                          <ul className="py-1 text-sm text-gray-700">
                            {userAccounts.map((account) => (
                              <li
                                key={account.publicAddress}
                                onClick={() => handleOptionClick(account)}
                                className={`cursor-pointer px-4 py-2 hover:bg-blue-50 ${
                                  selectedAccount?.accountName ===
                                  account.accountName
                                    ? "bg-blue-100"
                                    : ""
                                }`}
                              >
                                <div className="font-medium text-gray-900">
                                  {account.accountName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {account.truncatedAddress}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="to-address"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        To
                      </label>
                      <div className="mt-2">
                        <input
                          id="to-address"
                          name="to-address"
                          type="text"
                          autoComplete="to-address"
                          placeholder="Enter public address (0x)"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
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
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default SendCryptoTokenModal;
