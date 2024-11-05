export const getNetworkName = async (web3) => {
  const chainId = await web3.eth.getChainId();

  try {
    const response = await fetch("https://chainid.network/chains.json", {
      method: "GET",
      credentials: "include", // Include credentials in the request
    });
    console.log("response", response);

    const chains = await response.json();

    const network = chains.find((chain) => chain.chainId === chainId);
    return network ? network.name : "Unknown Network";
  } catch (error) {
    console.error("Error fetching network name:", error);
    return "Unknown Network"; // Fallback in case of error
  }
};
