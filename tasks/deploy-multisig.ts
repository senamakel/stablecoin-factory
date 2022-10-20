import { task, types } from "hardhat/config";
import { deployOrLoadAndVerify } from "./utils";

task("deploy-multisig", "Deploy multisig")
  .addParam("owners", "comma seperated 0x addresses of the safe owners")
  .addOptionalParam(
    "requirement",
    "how much confirmations needed to make a tx",
    1,
    types.int
  )
  .setAction(async ({ owners, requirement }, hre) => {
    const _owners = owners.split(",");
    const _requirement = requirement || _owners.length;

    await deployOrLoadAndVerify(hre, "MultiSigWallet", "MultiSigWallet", [
      _owners, // address[] memory _owners,
      _requirement, // uint256 _required
    ]);
  });
