// utils/getTokenBalance.js
export const getTokenBalance = async (
  web3,
  tokenAddress,
  publicAddress,
  tokenDecimals
) => {
  console.log("web3", web3);
  console.log("tokenAddress", tokenAddress);
  console.log("publicAddress", publicAddress);
  console.log("tokenDecimals", tokenDecimals);

  try {
    // ABI for balanceOf function
    const balanceABI = [
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
    ];

    // Instantiate contract
    const balanceContract = new web3.eth.Contract(balanceABI, tokenAddress);

    // Get balance from contract
    const balance = await balanceContract.methods
      .balanceOf(publicAddress)
      .call();

    // Convert balance to BigInt
    // eslint-disable-next-line no-undef
    const balanceBigInt = BigInt(balance);

    // Calculate divisor for decimals as BigInt
    // eslint-disable-next-line no-undef
    const decimalDivisor = BigInt(10) ** BigInt(tokenDecimals);

    // Format balance
    const formattedBalance = Number(balanceBigInt / decimalDivisor);

    return formattedBalance;
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return null;
  }
};
