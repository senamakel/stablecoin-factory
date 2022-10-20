import { deployOrLoadAndVerify, getOutputAddress } from "./utils";

async function main() {
  const wallet = await getOutputAddress("MultiSigWallet");
  const name = "USDB Coin";
  const symbol = "USDB";

  await deployOrLoadAndVerify(symbol, "StablecoinImpl", [
    name, // string memory _name,
    symbol, // string memory _symbol,
    wallet, // address _wallet
  ]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
