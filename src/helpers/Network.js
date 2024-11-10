class NetworkHelper {
  saveNetwork(selectedNetwork) {
    localStorage.setItem("networkName", JSON.stringify(selectedNetwork));
  }

  getNetworkRpcUrl() {
    const network = JSON.parse(localStorage.getItem("networkName"));
    return network?.rpcUrl || null;
  }

  getNetworkName() {
    const network = JSON.parse(localStorage.getItem("networkName"));
    return network?.name || null;
  }
  getNetworkHex() {
    const network = JSON.parse(localStorage.getItem("networkName"));
    return network?.hex || null;
  }
  getNetworkTicker() {
    const network = JSON.parse(localStorage.getItem("networkName"));
    return network?.ticker || null;
  }
}

export const Network = new NetworkHelper();
