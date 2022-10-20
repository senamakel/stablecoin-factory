import { deployOrLoadAndVerify } from "./utils";

async function main() {
  const owners = [
    "0x61837551968B5496c63EbCC82cBfE2C8e1Fe798c",
    "0x4D3150f1D4B4Aef92BEB9a88f3DC2901C75BcCec",
    "0xbA8DEBc3AF79b77BD2a6b39B02004257557C7953",
  ];

  const requirement = 2;

  await deployOrLoadAndVerify("MultiSigWallet", "MultiSigWallet", [
    owners, // address[] memory _owners,
    requirement, // uint256 _required
  ]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
