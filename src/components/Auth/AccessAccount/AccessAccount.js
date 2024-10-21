import React, { useEffect } from "react";

import ArisPayLogo from "../../../../src/images/logo/arispay_logo.png";
import { Link, useHistory } from "react-router-dom";
import Web3 from "web3";
import { AuthUser } from "../../../helpers/AuthUser";
import { useDispatch, useSelector } from "react-redux";
import { UrlBuilder } from "../../../helpers/UrlBuilder";
import { callApi, clearState, selectApi } from "../../../reducers/apiSlice";

const AccessAccount = () => {

  const { loading, loginVerify } = useSelector(selectApi);
  const dispatch = useDispatch();
  const history = useHistory();

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

    const challengeMessage = AuthUser.getChallengeMessage();
    const web3 = new Web3();

    try {
      // Add Ethereum prefix to the message
      // const prefix = `\x19Ethereum Signed Message:\n${challengeMessage.length}${challengeMessage}`;

      // const messageHash = web3.utils.sha3(prefix);

      // Sign the message hash
      const signature = web3.eth.accounts.sign(challengeMessage, privateKey);
      // const signature = web3.eth.accounts.sign(challengeMessage, privateKey);
      console.log("Signature:", signature);
      console.log("Public Key (Recovered from Signature):", web3.eth.accounts.recover(signature));

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

  useEffect(() => {
    if (loginVerify?.status === "success" ) {
      
      history.push("/user-account");
    }
  }, [history, loginVerify?.status]);

  useEffect(() => {
    dispatch(
      clearState({
        output: "loginVerify",
      })
    );
  }, [loginVerify?.status, dispatch]);

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
                <div
                  className="flex w-full justify-center rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 text-center"
                >
                  Challenge Message : {AuthUser.getChallengeMessage()}
                </div>
                <button
                  onClick={() => handleSignChallengeMessage()}
                  type="button"
                  className="mt-8 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Click here to Sign the challenge Message
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
