// Mapping of chain IDs to network names
const NETWORK_NAMES = {
  1: "Ethereum Mainnet",
  3: "Ropsten Testnet",
  4: "Rinkeby Testnet",
  5: "Goerli Testnet",
  42: "Kovan Testnet",
  56: "Binance Smart Chain",
  137: "Polygon Mainnet",
  80001: "Polygon Mumbai Testnet",
  11155111: "Sepolia Testnet",
  // Add other chain IDs as needed
};

export const getNetworkName = async (web3) => {
  const chainId = await web3.eth.getChainId();

  // Check if the chain ID is in the predefined list
  if (NETWORK_NAMES[chainId]) {
    return NETWORK_NAMES[chainId];
  }

  // Fallback to fetching from an external source if not found
  try {
    const response = await fetch("https://chainid.network/chains.json");
    const chains = await response.json();
    const network = chains.find((chain) => chain.chainId === chainId);
    return network ? network.name : "Unknown Network";
  } catch (error) {
    console.error("Error fetching network name:", error);
    return "Unknown Network";
  }
};
