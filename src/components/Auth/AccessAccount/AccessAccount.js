import React, { useEffect } from "react";

import ArisPayLogo from "../../../../src/images/logo/arispay_logo.png";
import { Link } from "react-router-dom";
import Web3 from "web3";
import { AuthUser } from "../../../helpers/AuthUser";
import { useDispatch, useSelector } from "react-redux";
import { UrlBuilder } from "../../../helpers/UrlBuilder";
import { callApi, selectApi } from "../../../reducers/apiSlice";

const AccessAccount = () => {
  const dispatch = useDispatch();

  console.log("Public", AuthUser.getPublicKey());
  console.log("Private", AuthUser.getPrivateKey());

  const handleSignChallengeMessage = async () => {
    let privateKey = AuthUser.getPrivateKey();

    if (
      !privateKey ||
      privateKey.length !== 66 ||
      !privateKey.startsWith("0x")
    ) {
      console.error("Invalid private key:", privateKey);
      return;
    }

    let challengeMessage = AuthUser.getChallengeMessage();

    // Web3.js will handle hashing and message prefixing internally
    try {
      const web3 = new Web3();
      const signature = await web3.eth.accounts.sign(
        challengeMessage,
        privateKey
      );

      console.log("Signature:", signature.signature);

      // Send the signed challenge along with the public key to the backend
      dispatch(
        callApi({
          operationId: UrlBuilder.cryptowalletApi("auth/login/verify"),
          output: "loginVerify",
          parameters: {
            method: "POST",
            body: JSON.stringify({
              publicKey: AuthUser.getPublicKey(),
              signature: signature.signature,
            }),
          },
        })
      );
    } catch (error) {
      console.error("Error signing the challenge message:", error);
    }
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
            ARISPAY Crypto Wallet
          </h2>
          <p className="mt-6 text-center text-lg font-normal leading-2 tracking-tight text-gray-600">
            The decentralized web awaits!
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow-md sm:rounded-lg sm:px-12">
            <div className="space-y-6">
              <div>
                <button
                  type="button"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Challenge Message : {AuthUser.getChallengeMessage()}
                </button>
                <button
                  onClick={() => handleSignChallengeMessage()}
                  type="button"
                  className="mt-12 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Click here to Sign the challenge Message with your Private key
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

export default AccessAccount;
