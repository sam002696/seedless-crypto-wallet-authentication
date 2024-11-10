import React, { useEffect, useState } from "react";
import NetworkModal from "../../Modal/NetworkModal/NetworkModal";
import { useDispatch } from "react-redux";
import { loadNetwork } from "../../../reducers/networkSlice";
import { Network } from "../../../helpers/Network";
import { AuthUser } from "../../../helpers/AuthUser";

const WalletInfo = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState({
    name: Network.getNetworkName() || "Ethereum Mainnet",
    hex: Network.getNetworkHex() || "0x1",
  });

  const handleNetwork = () => {
    setOpen(true);
  };

  console.log("selectedNetwork", selectedNetwork);

  useEffect(() => {
    dispatch(
      loadNetwork({
        rpcUrl:
          Network.getNetworkRpcUrl() ||
          process.env.REACT_APP_ETH_MAINNET_RPC_URL,
        ticker: Network.getNetworkTicker(),
      })
    );
  }, [dispatch]);

  return (
    <>
      <div className="flex flex-row justify-between items-center bg-white p-3 shadow-md">
        {/* Blockchain Network */}
        <div className="bg-gray-100 px-3 py-2 rounded-2xl">
          <button onClick={handleNetwork} className="font-medium text-sm">
            {Network.getNetworkName() || selectedNetwork.name}
          </button>
        </div>
        <div className="flex flex-col space-y-1">
          <p className="font-medium text-sm">Account 1</p>
          <div className="bg-gray-100 px-3 py-1.5 rounded-md">
            <p className="font-normal text-sm">{AuthUser.getPublicKey()}</p>
          </div>
        </div>
        <div>...</div>
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
