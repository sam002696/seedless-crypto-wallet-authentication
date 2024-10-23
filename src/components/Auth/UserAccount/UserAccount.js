import React, { useEffect, useState } from "react";

import ArisPayLogo from "../../../../src/images/logo/arispay_logo.png";
import { Link, useHistory } from "react-router-dom";

import { AuthUser } from "../../../helpers/AuthUser";
import {
  LockClosedIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

const UserAccount = () => {
  const history = useHistory();

  const [privateKeyVisible, setPrivateKeyVisible] = useState(false);
  const [holding, setHolding] = useState(false);
  const [holdTimer, setHoldTimer] = useState(null);

  const [isCopied, setIsCopied] = useState(false);
  const [tooltipText, setTooltipText] = useState("Copy to Clipboard");
  const userAddress = AuthUser?.getLoggedInUserAddress() || "0x000000"; // Default fallback

  // Truncate address (first 7 and last 5 characters)
  const truncatedAddress = `${userAddress.slice(0, 10)}...${userAddress.slice(
    -8
  )}`;

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Use the clipboard API if available
      navigator.clipboard
        .writeText(userAddress)
        .then(() => {
          setIsCopied(true);
          setTooltipText("Address Copied!");
          setTimeout(() => {
            setIsCopied(false);
            setTooltipText("Copy to Clipboard");
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    } else {
      // Fallback: create a temporary textarea for copying
      const tempTextArea = document.createElement("textarea");
      tempTextArea.value = userAddress;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      try {
        document.execCommand("copy");
        setIsCopied(true);
        setTooltipText("Address Copied!");
      } catch (err) {
        console.error("Fallback copy failed: ", err);
      }
      document.body.removeChild(tempTextArea);
      setTimeout(() => {
        setIsCopied(false);
        setTooltipText("Copy to Clipboard");
      }, 2000);
    }
  };

  const handleMouseDown = () => {
    setHolding(true);
    const timer = setTimeout(() => {
      setPrivateKeyVisible(true);
      setHolding(false);
    }, 3000); // 3 seconds
    setHoldTimer(timer);
  };

  const handleMouseUp = () => {
    setHolding(false);
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
  };

  useEffect(() => {
    return () => {
      if (holdTimer) {
        clearTimeout(holdTimer); // Clear timer on component unmount
      }
    };
  }, [holdTimer]);

  const handleLockOut = () => {
    AuthUser.removeLoginData();
    history.push("/");
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="ARISPAY Wallet"
            src={ArisPayLogo}
            className="mx-auto h-28 w-auto"
          />
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-300">
            ARISPAY CRYPTO WALLET
          </h2>
          <h2 className="mt-8 text-center text-3xl font-bold leading-9 tracking-tight text-blue-500">
            Arispay Account
          </h2>
          <p className="mt-2 text-center text-md font-normal leading-2 tracking-tight text-gray-600">
            Manage your everything in ARISPAY wallet!
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-6 py-12 shadow-2xl shadow-blue-600 sm:rounded-lg sm:px-12">
            <div className="space-y-6">
              <div>
                {/* <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <InformationCircleIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-blue-400"
                      />
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                      <p className="text-sm text-blue-700">
                        {AuthUser?.getLoggedInUserAddress()}
                        
                      </p>
                      <p className="mt-3 text-sm md:ml-6 md:mt-0">
                        <DocumentDuplicateIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-blue-400 "
                        />
                      </p>
                    </div>
                  </div>
                </div> */}
                <div
                  className="rounded-md bg-blue-50 p-4 cursor-pointer hover:bg-blue-100 transition-colors duration-200 max-w-sm mx-auto"
                  onClick={handleCopy}
                  title={tooltipText} // Tooltip to show on hover
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <InformationCircleIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-blue-400"
                      />
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between items-center">
                      <p className="text-sm text-blue-700 tracking-widest">
                        {truncatedAddress}
                      </p>
                      <div className="mt-3 text-sm md:ml-6 md:mt-0">
                        {isCopied ? (
                          <CheckCircleIcon
                            aria-hidden="true"
                            className="h-5 w-5 text-blue-500"
                          />
                        ) : (
                          <DocumentDuplicateIcon
                            aria-hidden="true"
                            className="h-5 w-5 text-blue-400"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp} // Clear timer if mouse leaves the button
                    className={`mt-6 flex w-full justify-center rounded-md ${
                      privateKeyVisible ? "bg-green-400" : "bg-green-400"
                    } px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 break-all`}
                  >
                    {privateKeyVisible ? (
                      <>
                        Private key: <br />
                        {AuthUser.getPrivateKey()}
                      </>
                    ) : (
                      <>
                        <LockClosedIcon
                          className={`mr-2 size-6 ${
                            holding ? "animate-bounce" : ""
                          }`}
                        />
                        {/* Optional icon with animation */}
                        Hold Button To Reveal The Private Key
                      </>
                    )}
                  </button>
                </div>
                <button
                  onClick={() => handleLockOut()}
                  type="button"
                  className="mt-6 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Lock Account
                </button>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Need help?{" "}
            <Link
              to="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Contact ARISPAY Support
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default UserAccount;
