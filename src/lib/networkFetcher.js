import Web3 from "web3";
import { AuthUser } from "../helpers/AuthUser";
import { getNetworkName } from "../utilities/getNetworkName";

const networkFetcher = async (operationId, parameters = {}) => {
  console.log("parameters", parameters);
  console.log("operationId", operationId);

  try {
    const { rpcUrl, ticker } = parameters;

    // Initialize Web3 with the dynamic RPC URL
    const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    console.log("web3", web3);

    // Use AuthUser to get the public address
    const publicAddress = AuthUser.getPublicKey();
    console.log("publicAddress", publicAddress);

    // based on operation id
    // we will get two cases and return the values
    switch (operationId) {
      case "getAccountInfo": {
        if (!publicAddress) throw new Error("No public address found.");

        const balanceWei = await web3.eth.getBalance(publicAddress);
        console.log("balanceWei", balanceWei);
        const balance = web3.utils.fromWei(balanceWei, "ether");

        console.log("balance", balance);

        return { account: publicAddress, balance };
      }

      case "getNetworkInfo": {
        const networkId = await web3.eth.net.getId(); // Fetches network ID
        const chainId = await web3.eth.getChainId(); // Fetches chain ID
        const name = await getNetworkName(web3);

        const hex = "0x" + chainId.toString(16);

        console.log("networkId", networkId);
        console.log("chainId", chainId);
        console.log("networkName", name);
        console.log("hex", hex);

        return { networkId, chainId, name, hex, ticker };
      }

      default:
        throw new Error(`Unknown operationId: ${operationId}`);
    }
  } catch (error) {
    console.error("Blockchain fetcher error:", error);
    throw error;
  }
};

export default networkFetcher;
