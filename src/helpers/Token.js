class TokenHelper {
  saveToken(existingTokenList) {
    localStorage.setItem("TokenList", JSON.stringify(existingTokenList));
  }

  getToken() {
    const tokenList = JSON.parse(localStorage.getItem("TokenList"));
    return tokenList || [];
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
