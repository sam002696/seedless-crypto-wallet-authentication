import React, { useEffect, useState } from "react";

import ArisPayLogo from "../../../../src/images/logo/arispay_logo.png";
import { Link, useHistory } from "react-router-dom";
import Web3 from "web3";
import { AuthUser } from "../../../helpers/AuthUser";
import { useDispatch, useSelector } from "react-redux";
import { UrlBuilder } from "../../../helpers/UrlBuilder";
import { callApi, clearState, selectApi } from "../../../reducers/apiSlice";
import { ClockIcon, LockClosedIcon } from "@heroicons/react/24/solid";
// import ethUtil from "ethereumjs-util"; // Import ethereumjs-util

const CreateAccount = () => {
  const { loading, challengeMessage } = useSelector(selectApi);
  const dispatch = useDispatch();
  const history = useHistory();

  const [privateKeyVisible, setPrivateKeyVisible] = useState(false);
  const [holding, setHolding] = useState(false);
  const [holdTimer, setHoldTimer] = useState(null);

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

  console.log("challengeMessage", challengeMessage);

  useEffect(() => {
    if (challengeMessage && challengeMessage?.data !== undefined) {
      AuthUser.saveChallengeMessage(challengeMessage?.data);
      history.push("/access-account");
    }
  }, [history, challengeMessage?.data]);

  useEffect(() => {
    dispatch(
      clearState({
        output: "challengeMessage",
      })
    );
  }, [challengeMessage?.data]);

  const handleGenerateKeyPair = () => {
    const web3 = new Web3();
    const account = web3.eth.accounts.create();

    const privateKey = account.privateKey;
    const address = account.address;

    // Derive the public key from the private key
    const derivedPublicKey =
      web3.eth.accounts.privateKeyToAccount(privateKey).publicKey;
    console.log("Public Key:", derivedPublicKey);

    console.log("Public Key:", derivedPublicKey);
    console.log("Private Key:", privateKey);
    console.log("Public Address:", address);

    AuthUser.savePublicKey(account.address);
    AuthUser.savePrivateKey(account.privateKey);

    dispatch(
      callApi({
        operationId: UrlBuilder.cryptowalletApi("auth/register"),
        output: "publicKey",
        parameters: {
          method: "POST",
          body: JSON.stringify({ publicKey: account.address }),
        },
      })
    );
  };

  console.log("private key from localstorage", AuthUser.getPrivateKey());

  console.log("challengeMessage", challengeMessage?.data);
  console.log("challengeMessage auth user", AuthUser?.getChallengeMessage());

  const handleSendPublicKey = () => {
    dispatch(
      callApi({
        operationId: UrlBuilder.cryptowalletApi("auth/login/challenge"),
        output: "challengeMessage",
        parameters: {
          method: "POST",
          body: JSON.stringify({ publicKey: AuthUser.getPublicKey() }),
        },
      })
    );
  };

  return (
    <>
      {AuthUser.getLoggedInUserAddress() &&
      AuthUser.getLoggedInUserAddress().length > 0 ? (
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

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
              <div className="bg-white px-6 py-8 shadow-md sm:rounded-lg sm:px-12">
                <div className="space-y-6">
                  <div>
                    <button
                      onClick={() => handleSendPublicKey()}
                      type="button"
                      className="flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                    >
                      Go to your wallet account
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
      ) : (
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

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
              <div className="bg-white px-6 py-8 shadow-md sm:rounded-lg sm:px-12">
                <div className="space-y-6">
                  <div>
                    <button
                      onClick={() => handleGenerateKeyPair()}
                      type="button"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Generate Key Pair
                    </button>
                  </div>
                  {AuthUser.getPublicKey() &&
                    AuthUser.getPublicKey().length > 0 && (
                      <>
                        <div>
                          <div className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 text-center">
                            Public key : <br />
                            {AuthUser.getPublicKey()}
                          </div>
                        </div>
                        {/* <div>
                      <button
                        type="button"
                        className="flex w-full justify-center rounded-md bg-green-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 break-all"
                      >
                        Private key : <br/>
                        {AuthUser.getPrivateKey()}
                      </button>
                    </div> */}

                        <div>
                          <button
                            type="button"
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp} // Clear timer if mouse leaves the button
                            className={`flex w-full justify-center rounded-md ${
                              privateKeyVisible
                                ? "bg-green-500"
                                : "bg-green-400"
                            } px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 break-all`}
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
                                Hold the button to reveal the private key
                              </>
                            )}
                          </button>
                        </div>

                        <div>
                          <button
                            onClick={() => handleSendPublicKey()}
                            type="button"
                            className="flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                          >
                            Go to your wallet account
                          </button>
                        </div>
                      </>
                    )}
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
      )}
    </>
  );
};

export default CreateAccount;
