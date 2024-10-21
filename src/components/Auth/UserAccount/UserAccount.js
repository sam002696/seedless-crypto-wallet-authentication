import React, { useEffect } from "react";

import ArisPayLogo from "../../../../src/images/logo/arispay_logo.png";
import { Link, useHistory } from "react-router-dom";
import Web3 from "web3";
import { AuthUser } from "../../../helpers/AuthUser";
import { useDispatch, useSelector } from "react-redux";
import { UrlBuilder } from "../../../helpers/UrlBuilder";
import { callApi, clearState, selectApi } from "../../../reducers/apiSlice";

const UserAccount = () => {
//   const { loading, challengeMessage } = useSelector(selectApi);
//   const dispatch = useDispatch();
  const history = useHistory();

  const handleLockOut = () => {
    

    AuthUser.removeLoginData()
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
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome to ARISPAY Crypto Wallet
          </h2>
          <p className="mt-6 text-center text-lg font-normal leading-2 tracking-tight text-gray-600">
            Your Wallet Address :  {AuthUser.getPublicKey()}
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow-md sm:rounded-lg sm:px-12">
            <div className="space-y-6">

              <div>
                <button
                  onClick={() => handleLockOut()}
                  type="button"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Lock Out from Account
                </button>
              </div>
              
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Need help?{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Contact ARISPAY Support
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default UserAccount;
