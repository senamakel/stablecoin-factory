import { task } from "hardhat/config";
import { deployOrLoadAndVerify, getOutputAddress } from "./utils";

task("deploy-stablecoin", "Deploys the stablecoin")
  .addParam("symbol", "symbol of the token (eg: USD-A)")
  .addParam("name", "name of the token (eg: USD-A Coin)")
  .addOptionalParam("multisig", "address of the multisig owner")
  .setAction(async ({ name, symbol, multisig }, hre) => {
    const _wallet = multisig || (await getOutputAddress(hre, "MultiSigWallet"));

    await deployOrLoadAndVerify(hre, symbol, "StablecoinImpl", [
      name, // string memory _name,
      symbol, // string memory _symbol,
      _wallet, // address _wallet
    ]);
  });
