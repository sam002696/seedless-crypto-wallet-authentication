import React from "react";
import Asset from "./Asset";

const From = ({
  setIsOpen,
  isOpen,
  userAccounts,
  setSelectedAccount,
  selectedAccount,
  showAsset,
  assetInput,
  updateAssetInput,
}) => {
  // to open all the accounts of the wallet
  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (account) => {
    //  sets the value of
    // the clicked account
    setSelectedAccount(account);

    // clicking on one account
    // closes the modal
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative col-span-full">
        <label
          htmlFor="account"
          className="block text-sm font-medium text-gray-900 mb-3"
        >
          From
        </label>
        <button
          id="account"
          onClick={handleDropdownToggle}
          className="w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:text-sm flex justify-between items-center"
        >
          <div className="text-start">
            <p className="font-medium">
              {selectedAccount
                ? selectedAccount.accountName
                : "Choose a account"}
            </p>
            <p className="text-md text-gray-500 ">
              {selectedAccount ? selectedAccount.truncatedAddress : ""}
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
                    selectedAccount?.accountName === account.accountName
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

        {/* Asset component */}
        {showAsset && (
          <>
            <Asset
              assetInput={assetInput}
              updateAssetInput={updateAssetInput}
              showDownIcon={true}
              makeAssetsDisable={false}
              showAdditonalInfo={false}
            />
          </>
        )}
      </div>
    </>
  );
};

export default From;
