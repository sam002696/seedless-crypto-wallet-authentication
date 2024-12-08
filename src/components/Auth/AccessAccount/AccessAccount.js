import React, { useEffect } from "react";

import ArisPayLogo from "../../../../src/images/logo/arispay_logo.png";
import { Link, useHistory } from "react-router-dom";
import Web3 from "web3";
import { AuthUser } from "../../../helpers/AuthUser";
import { useDispatch, useSelector } from "react-redux";
import { UrlBuilder } from "../../../helpers/UrlBuilder";
import { callApi, clearState, selectApi } from "../../../reducers/apiSlice";
import { Redirect } from "react-router-dom";

const AccessAccount = () => {
  const { loginVerify = { data: {} } } = useSelector(selectApi);
  const dispatch = useDispatch();
  const history = useHistory();

  console.log("loginVerify", loginVerify);
  // console.log("Public", AuthUser.getPublicKey());
  // console.log("Private", AuthUser.getPrivateKey());

  // if (loginVerify.data.accessToken !== undefined && loginVerify.data.accessToken !== null) {
  //   AuthUser.saveLoginData(loginVerify);
  //   return <Redirect to="/user-account" />;
  // }

  useEffect(() => {
    // Clear previous loginVerify state only when status is 'success'
    if (loginVerify?.status === "success") {
      AuthUser.saveLoginData(loginVerify);

      // Reset loginVerify state after a successful login
      dispatch(
        clearState({
          output: "loginVerify",
        })
      );
    }
  }, [loginVerify?.status, dispatch]); // Only re-run the effect when loginVerify.status changes

  console.log("loginVerify", loginVerify);
  // Safely check if accessToken exists before redirecting
  if (loginVerify?.data?.accessToken) {
    return <Redirect to="/wallet" />;
  }

  console.log("loginVerify", loginVerify);

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
      // Sign the message hash
      const signature = web3.eth.accounts.sign(challengeMessage, privateKey);
      console.log("Signature:", signature);
      console.log(
        "Public Key (Recovered from Signature):",
        web3.eth.accounts.recover(signature)
      );

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

  // useEffect(() => {
  //   if (loginVerify.data.accessToken !== undefined && loginVerify.data.accessToken !== null) {
  //     AuthUser.saveLoginData(loginVerify);
  //     // return <Redirect to="/user-account" />;
  //     history.push("/user-account");
  //   }
  // }, [history, loginVerify?.status]);

  // if (loginVerify.data.accessToken !== undefined && loginVerify.data.accessToken !== null) {
  //   AuthUser.saveLoginData(loginVerify);
  //   return <Redirect to="/user-account" />;
  // }

  // useEffect(() => {
  //   if(loginVerify.status === "success")
  //   dispatch(
  //     clearState({
  //       output: "loginVerify",
  //     })
  //   );
  // });

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
            Wallet Verification
          </h2>
          <p className="mt-2 text-center text-md font-normal leading-2 tracking-tight text-gray-600">
            Unlock your account with challenge message verification!
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-6 py-12 shadow-2xl shadow-blue-600 sm:rounded-lg sm:px-12">
            <div className="space-y-6">
              <div>
                <div className="flex w-full justify-center rounded-md bg-purple-500 px-3 py-1.5 text-md font-normal font-mono leading-6 text-white shadow-sm hover:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 text-center">
                  Challenge Message: <br />
                  {AuthUser.getChallengeMessage()}
                </div>
                <button
                  onClick={() => handleSignChallengeMessage()}
                  type="button"
                  className="mt-8 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign Challenge Message
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
