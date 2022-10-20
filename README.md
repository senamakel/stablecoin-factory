# Stablecoin Contracts

To deploy the mutlisig wallet run

```shell
npx hardhat deploy-multisig --owners 0x61837551968B5496c63EbCC82cBfE2C8e1Fe798c,0x4D3150f1D4B4Aef92BEB9a88f3DC2901C75BcCec,0xbA8DEBc3AF79b77BD2a6b39B02004257557C7953 --network goerli
```

To deploy a stablecoin run

```shell
npx hardhat deploy-stablecoin --symbol USDA --name "USDA Coin" --network goerli
```
