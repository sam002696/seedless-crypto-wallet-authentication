import React, { useEffect, useState } from "react";
import Web3 from "web3";
import NetworkModal from "../../Modal/NetworkModal/NetworkModal";
import { useDispatch, useSelector } from "react-redux";
import {
  addToken,
  loadNetwork,
  selectNetwork,
  updateTokenBalances,
} from "../../../reducers/networkSlice";
import { Network } from "../../../helpers/Network";
import { AuthUser } from "../../../helpers/AuthUser";
import { Token } from "../../../helpers/Token";
import {
  DocumentDuplicateIcon,
  CheckCircleIcon,
  Bars3CenterLeftIcon,
} from "@heroicons/react/24/solid";
import { getTokenBalance } from "../../../utilities/getTokenBalance";

const WalletInfo = ({ disableNetwork }) => {
  const selectedNetworkInfo = useSelector(selectNetwork);
  const dispatch = useDispatch();
  const [selectedNetwork, setSelectedNetwork] = useState({
    name: Network.getNetworkName() || "Ethereum Mainnet",
    hex: Network.getNetworkHex() || "0x1",
  });
  const [open, setOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [tooltipText, setTooltipText] = useState("Copy to Clipboard");
  const userAddress = AuthUser?.getLoggedInUserAddress() || "0x000000";
  const truncatedAddress = `${userAddress.slice(0, 10)}...${userAddress.slice(
    -8
  )}`;

  // to copy the public address
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

  // opening the network list modal
  const handleNetwork = () => {
    setOpen(true);
  };

  // preserving network related info when refreshed
  useEffect(() => {
    dispatch(
      loadNetwork({
        rpcUrl: Network.getNetworkRpcUrl(),
        ticker: Network.getNetworkTicker(),
        hex: Network.getNetworkHex(),
      })
    );
  }, [dispatch]);

  // preserving token related info when refreshed
  useEffect(() => {
    dispatch(addToken([Token.getToken(), Network.getNetworkHex()]));
  }, [dispatch]);

  // preserving and
  // updating balances from web3
  useEffect(() => {
    let isMounted = true;

    const fetchBalances = async () => {
      try {
        const web3 = new Web3(
          Web3.givenProvider || selectedNetworkInfo?.rpcUrl
        );
        if (Array.isArray(selectedNetworkInfo?.token)) {
          const balances = await Promise.all(
            selectedNetworkInfo.token.map(async (token) => {
              const balance = await getTokenBalance(
                web3,
                token?.tokenAddress,
                AuthUser.getPublicKey(),
                token?.tokenDecimals
              );

              return {
                symbol: token.tokenSymbol,
                balance,
                tokenAddress: token.tokenAddress,
              };
            })
          );
          if (isMounted) {
            dispatch(updateTokenBalances({ balances }));
          }
        }
      } catch (error) {
        console.error("Error fetching token balances: ", error);
      }
    };

    fetchBalances();

    return () => {
      isMounted = false;
    };
  }, [dispatch, selectedNetworkInfo]);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 items-center bg-white p-4 shadow-md">
        {/* Blockchain Network */}
        <div className="flex justify-start ">
          <button
            onClick={handleNetwork}
            disabled={disableNetwork}
            className="font-medium text-sm bg-gray-100 px-3 py-2 rounded-2xl disabled:cursor-not-allowed"
          >
            {Network.getNetworkName() || selectedNetwork.name}
          </button>
        </div>

        {/* Account Details */}
        <div className="flex flex-col items-center space-y-1">
          <p className="font-medium text-sm text-center">Account 1</p>
          <div
            className="rounded-md p-1 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            onClick={handleCopy}
            title={tooltipText} // Tooltip to show on hover
          >
            <div className="flex items-center">
              <div className="ml-3 flex-1 md:flex md:justify-between items-center">
                <p className="text-sm text-gray-700 tracking-widest">
                  {truncatedAddress}
                </p>
                <div className="mt-3 text-sm md:ml-2 md:mt-0">
                  {isCopied ? (
                    <CheckCircleIcon
                      aria-hidden="true"
                      className="h-4 w-4 text-gray-500"
                    />
                  ) : (
                    <DocumentDuplicateIcon
                      aria-hidden="true"
                      className="h-4 w-4 text-gray-400"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Icon */}
        <div className="flex justify-end">
          <Bars3CenterLeftIcon
            aria-hidden="true"
            className="h-4 w-4 text-gray-500"
          />
        </div>
      </div>

      {/* Import Networks */}
      <NetworkModal
        setOpen={setOpen}
        open={open}
        selectedNetwork={selectedNetwork}
        setSelectedNetwork={setSelectedNetwork}
      />
    </>
  );
};

export default WalletInfo;
