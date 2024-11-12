import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedNetwork: {
    name: "Ethereum Mainnet",
    hex: "0x1",
    rpcUrl: "https://mainnet.infura.io/v3/75573f1a11f84a848d4e7292fe2fb5b9",
    account: null,
    balance: null,
    networkId: null,
    chainId: null,
    token: [],
  },
  loading: false,
  error: null,
};

export const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    loadNetwork: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadNetworkSuccess: (state, { payload }) => {
      state.selectedNetwork = {
        ...state.selectedNetwork,
        ...payload,
      };
      state.loading = false;
    },
    loadNetworkFailure: (state, { payload }) => {
      state.error = payload.error;
      state.loading = false;
    },
    setSelectedNetwork: (state, { payload }) => {
      state.selectedNetwork = {
        ...state.selectedNetwork,
        ...payload.network,
      };
    },
    addToken: (state, { payload }) => {
      console.log("payload", payload);
      const [tokens, networkHex] = payload; // Destructure payload to get tokens array and network hex

      tokens.forEach((newToken) => {
        const { tokenAddress, tokenChainIdHex } = newToken;

        // Check if the token's chainIdHex matches the selected network's hex
        if (tokenChainIdHex === networkHex) {
          console.log("Matching network hex:", networkHex);

          // Check if the token already exists in the token array
          const tokenExists = state.selectedNetwork.token.some(
            (token) => token.tokenAddress === tokenAddress
          );

          // Add the token only if it doesn't already exist
          if (!tokenExists) {
            state.selectedNetwork.token.push(newToken);
            console.log("Token added:", newToken);
          } else {
            console.log("Token already exists:", newToken);
          }
        }
      });
    },
  },
});

export const {
  loadNetwork,
  loadNetworkSuccess,
  loadNetworkFailure,
  setSelectedNetwork,
  addToken,
} = networkSlice.actions;

export const selectNetwork = (state) => state.network.selectedNetwork;
export const selectLoading = (state) => state.network.loading;
export const selectError = (state) => state.network.error;

export default networkSlice.reducer;
