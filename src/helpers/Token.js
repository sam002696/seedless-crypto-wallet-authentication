class TokenHelper {
  saveToken(existingTokenList) {
    localStorage.setItem("TokenList", JSON.stringify(existingTokenList));
  }

  saveSelectedToken(singleToken) {
    localStorage.setItem("SingleTokenView", JSON.stringify(singleToken));
  }

  getToken() {
    const tokenList = JSON.parse(localStorage.getItem("TokenList"));
    return tokenList || [];
  }

  getsingleToken() {
    const singleTokenView = JSON.parse(localStorage.getItem("SingleTokenView"));
    return singleTokenView || null;
  }

  // getNetworkHex() {
  //   const network = JSON.parse(localStorage.getItem("networkName"));
  //   return network?.hex || null;
  // }
  // getNetworkTicker() {
  //   const network = JSON.parse(localStorage.getItem("networkName"));
  //   return network?.ticker || null;
  // }
}

export const Token = new TokenHelper();
