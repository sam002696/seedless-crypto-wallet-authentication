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
      const [tokens, networkHex] = payload;

      if (state.selectedNetwork.hex !== networkHex) {
        state.selectedNetwork.token = [];
      }

      tokens.forEach((newToken) => {
        const { tokenAddress, tokenChainIdHex } = newToken;

        if (tokenChainIdHex === networkHex) {
          const tokenExists = state.selectedNetwork.token.some(
            (token) => token.tokenAddress === tokenAddress
          );

          if (!tokenExists) {
            state.selectedNetwork.token.push(newToken);
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
  checkAndClearTokens,
} = networkSlice.actions;

export const selectNetwork = (state) => state.network.selectedNetwork;
export const selectLoading = (state) => state.network.loading;
export const selectError = (state) => state.network.error;

export default networkSlice.reducer;
