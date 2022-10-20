import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function fixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    const multiSigWallet = await MultiSigWallet.deploy(
      [owner.address, otherAccount.address],
      2
    );

    const StablecoinImpl = await ethers.getContractFactory("StablecoinImpl");
    const usda = await StablecoinImpl.deploy(
      "USDA Coin",
      "USDA",
      multiSigWallet.address
    );

    return { multiSigWallet, usda, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { multiSigWallet, usda, owner, otherAccount } = await loadFixture(
        fixture
      );

      await multiSigWallet
        .connect(owner)
        .submitTransaction(
          usda.address,
          0,
          usda.interface.encodeFunctionData("mint", [owner.address, "1000"])
        );

      await multiSigWallet.connect(otherAccount).confirmTransaction("0");
      // await multiSigWallet.connect(owner).confirmTransaction("0");
    });

    // it("Should set the right owner", async function () {
    //   const { lock, owner } = await loadFixture(deployOneYearLockFixture);

    //   expect(await lock.owner()).to.equal(owner.address);
    // });

    // it("Should receive and store the funds to lock", async function () {
    //   const { lock, lockedAmount } = await loadFixture(
    //     deployOneYearLockFixture
    //   );

    //   expect(await ethers.provider.getBalance(lock.address)).to.equal(
    //     lockedAmount
    //   );
    // });

    // it("Should fail if the unlockTime is not in the future", async function () {
    //   // We don't use the fixture here because we want a different deployment
    //   const latestTime = await time.latest();
    //   const Lock = await ethers.getContractFactory("Lock");
    //   await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //     "Unlock time should be in the future"
    //   );
    // });
  });
});
