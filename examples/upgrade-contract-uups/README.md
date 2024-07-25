## Defender SDK upgrade

This example showcases a simple contract upgrade using UUPS + ownable. For simplicity, we just upgrade the original contract to the same implementation address.

### Steps to run this example

1. Create a deployment environment in sepolia network, (https://docs.openzeppelin.com/defender/v2/tutorial/deploy#environment_setup)[see how]
2. Go to https://wizard.openzeppelin.com/#custom
3. Select Ownable + UUPS upgradeablity.
4. Deploy the contract AND the proxy.
5. Use the deployed contract addresses as follows:

```js
const upgrade = await client.deploy.upgradeContract({
  proxyAddress: '0x3a...ad7', // erc1967 proxy address
  newImplementationAddress: '0x484...99', // address of the new implementation contract
  newImplementationABI: JSON.stringify(uupsOwnableAbi), // The ABI of the new implementation (must implement UUPS standard)
  network: 'sepolia',
});
```

6. Go to your defender dashboard to see the status of your upgrade.
