import { useSelector } from "react-redux";
import { selectNetwork, updateTokenBalances } from "../reducers/networkSlice";
import { getTokenBalance } from "./getTokenBalance";

export const fetchAndSyncTokenBalances =
  (web3, publicAddress) => async (dispatch) => {
    const selectedNetworkInfo = useSelector(selectNetwork);
    console.log("selectedNetworkInfo", selectedNetworkInfo);
    const token = selectedNetworkInfo?.token;
    // const { selectedNetwork } = getState().network;
    // const { token, hex } = selectedNetwork;

    console.log("token", token);

    const balances = await Promise.all(
      token.map(async ({ tokenAddress, tokenDecimals }) => {
        try {
          const balance = await getTokenBalance(
            web3,
            tokenAddress,
            publicAddress,
            tokenDecimals
          );
          return { tokenAddress, balance };
        } catch (error) {
          console.error(
            "Error fetching balance for token:",
            tokenAddress,
            error
          );
          return { tokenAddress, balance: 0 };
        }
      })
    );

    console.log("balances", balances);

    dispatch(updateTokenBalances({ balances }));
  };
