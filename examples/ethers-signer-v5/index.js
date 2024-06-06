require('dotenv').config();

const { ethers, version } = require('ethers');
const ERC20Abi = require('./erc20.json');
const ERC20Bytecode = require('./bytecode.json')[0].data.bytecode.object;
const { domain, types, value } = require('./typedData.json');
const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  const creds = {
    relayerApiKey: process.env.RELAYER_API_KEY,
    relayerApiSecret: process.env.RELAYER_API_SECRET,
  };
  const validUntil = new Date(Date.now() + 120 * 1000).toISOString();

  const client = new Defender(creds);
  console.log('using ethers version ', version);
  const provider = client.relaySigner.getProvider();
  const signer = await client.relaySigner.getSigner(provider, { speed: 'fast', validUntil });

  const factory = new ethers.ContractFactory(ERC20Abi, ERC20Bytecode, signer);

  console.log(`Deploying ERC20 contract`);
  const erc20 = await factory.deploy(100, { gasLimit: 8000000 });
  console.log(`Contract deployed at address ${erc20.address}`);

  const beneficiary = await ethers.Wallet.createRandom().getAddress();

  const addr = await signer.getAddress();
  console.log(`Relayer address is ${addr}`);

  console.log(`Sending approve transaction for ${beneficiary} to token ${erc20.address}...`);
  const tx = await erc20.approve(beneficiary, (1e17).toString(), { gasPrice: 1e10, gasLimit: 8000000 });
  console.log(`Transaction sent:`, tx);

  const mined = await tx.wait();
  console.log(`Transaction mined:`, mined);

  const allowance = await erc20.allowance(tx.from, beneficiary);
  console.log(`Allowance now is:`, allowance.toString());

  const sig = await signer.signMessage('0xdead');
  console.log(`Signature is ${sig}`);

  const sigAddress = ethers.utils.verifyMessage('Funds are safu!', sig);
  console.log(`Signature address is ${sigAddress} matching relayer address ${mined.from}`);

  const typedSig = await signer._signTypedData(domain, types, value);
  console.log(`Typed data signature is ${typedSig}`);

  const typedSigAddress = ethers.utils.verifyTypedData(domain, types, value, typedSig);
  console.log(`Typed data signature address is ${typedSigAddress} matching relayer address ${mined.from}`);
}

if (require.main === module) {
  main().catch(console.error);
}
