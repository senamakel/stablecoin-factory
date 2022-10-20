import * as fs from "fs";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default async function verifyContract(
  hre: HardhatRuntimeEnvironment,
  address: string,
  constructorArguments: any[]
) {
  try {
    // await wait(20 * 1000); // wait for 20s

    await hre.run("verify:verify", {
      address,
      constructorArguments,
    });
  } catch (error: any) {
    console.log(error);
    if (error.name !== "NomicLabsHardhatPluginError") {
      console.error(`- Error verifying: ${error.name}`);
      console.error(error);
    }
  }
}

export const saveABI = (
  hre: HardhatRuntimeEnvironment,
  key: string,
  abi: string,
  address: string,
  verified: boolean
) => {
  const filename = `./deployments/${hre.network.name}.json`;

  let outputFile: any = {};
  if (fs.existsSync(filename)) {
    const data = fs.readFileSync(filename).toString();
    outputFile = data === "" ? {} : JSON.parse(data);
  }

  outputFile[key] = {
    abi,
    verified,
    address,
  };

  fs.writeFileSync(filename, JSON.stringify(outputFile, null, 2));
  console.log(`saved ${key}:${address} into ${hre.network.name}.json`);
};

export const getOutput = (
  hre: HardhatRuntimeEnvironment,
  _network?: string
) => {
  const filename = `./deployments/${_network || hre.network.name}.json`;

  let outputFile: any = {};
  if (fs.existsSync(filename)) {
    const data = fs.readFileSync(filename).toString();
    outputFile = data === "" ? {} : JSON.parse(data);
  }

  return outputFile;
};

export const getOutputAddress = (
  hre: HardhatRuntimeEnvironment,
  key: string,
  _network?: string
) => {
  const outputFile = getOutput(hre, _network);
  if (!outputFile[key]) return;
  return outputFile[key].address;
};

export const deployOrLoad = async (
  hre: HardhatRuntimeEnvironment,
  key: string,
  contractName: string,
  args: any[]
) => {
  const addr = await getOutputAddress(hre, key);
  if (addr) {
    console.log(`using ${key} at ${addr}`);
    return await hre.ethers.getContractAt(contractName, addr);
  }

  const { provider } = hre.ethers;
  const estimateGasPrice = await provider.getGasPrice();
  const gasPrice = estimateGasPrice.mul(5).div(4);

  console.log(
    `\ndeploying ${key} at ${hre.ethers.utils.formatUnits(
      gasPrice,
      `gwei`
    )} gwei`
  );
  const factory = await hre.ethers.getContractFactory(contractName);
  const instance = await factory.deploy(...args, { gasPrice });
  await instance.deployed();
  console.log(
    `${instance.address} -> tx hash: ${instance.deployTransaction.hash}`
  );

  await saveABI(hre, key, contractName, instance.address, false);
  return instance;
};

export const deployOrLoadAndVerify = async (
  hre: HardhatRuntimeEnvironment,
  key: string,
  contractName: string,
  args: any[],
  delay: number = 0
) => {
  const instance = await deployOrLoad(hre, key, contractName, args);

  const outputFile = getOutput(hre);
  if (!outputFile[key].verified) {
    await wait(delay);
    await verifyContract(hre, instance.address, args);
    await saveABI(hre, key, contractName, instance.address, true);
  }

  return instance;
};
