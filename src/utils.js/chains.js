const Ethereum = {
  hex: "0x1",
  name: "Ethereum",
  rpcUrl: "https://mainnet.infura.io/v3/d84fc50e49134ca289a38ab0bd749e59",
  ticker: "ETH",
};

const Sepolia = {
  hex: "0xaa36a7",
  name: "Ethereum Sepolia",
  rpcUrl: "https://sepolia.infura.io/v3/d84fc50e49134ca289a38ab0bd749e59",
  ticker: "SepoliaETH",
};

export const CHAINS_CONFIG = {
  "0x1": Ethereum,
  "0xaa36a7": Sepolia,
};
