require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');
const { Interface } = require('ethers');
const https = require('https');

const contractABI = require('./abi/demoflash.json');

async function main() {
  const creds = {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    //optional https config to keep connection alive. You can pass any configs that are accepted by https.Agent
    httpsAgent: https.Agent({ keepAlive: true }),
  };
  const client = new Defender(creds);

  // Create a new proposal
  const proposal = await client.proposal.create({
    proposal: {
      contract: {
        address: '0xA91382E82fB676d4c935E601305E5253b3829dCD',
        network: 'mainnet',
      },
      title: 'Flash',
      description: 'Call the Flash() function',
      type: 'custom',
      metadata: {
        sendTo: '0xA91382E82fB676d4c935E601305E5253b3829dCD',
        sendValue: '10000000000000000',
        sendCurrency: {
          name: 'Ethereum',
          symbol: 'ETH',
          decimals: 18,
          type: 'native',
        },
      },
      functionInterface: { name: 'flash', inputs: [] },
      functionInputs: [],
      via: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      viaType: 'EOA',
    },
  });

  console.log(`Created proposal (${proposal.proposalId})`);

  const contractInterface = new Interface(contractABI);
  // encode function data
  const data = contractInterface.encodeFunctionData(proposal.functionInterface.name, proposal.functionInputs);

  try {
    // Simulate the proposal
    const simulation = await client.proposal.simulate(proposal.proposalId, {
      contractId: proposal.contractId,
      transaction: {
        transactionData: {
          from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // change this to impersonate the `from` address
          data,
          to: proposal.contract.address,
          value: proposal.metadata.sendValue ?? '10000000000000000',
        },
        // default to latest finalized block,
        // can be up to 100 blocks ahead of current block,
        // does not support previous blocks
        blockNumber: undefined,
      },
    });

    // Check if simulation reverted under `simulation.meta.reverted`
    // and the reason string `simulation.meta.returnString`
    if (simulation.meta.reverted) {
      console.log('Transaction reverted:', simulation.meta.returnString ?? simulation.meta.returnValue);
    } else {
      console.log(simulation);
    }
  } catch (e) {
    if (e.response && e.response.data) {
      console.error(e.response.data.message);
    } else {
      console.error(e);
    }
  }

  // Alternatively you can initiate a simulation request as part of `createProposal`
  const proposalWithSimulation = await client.proposal.create({
    proposal: {
      contract: {
        address: '0xA91382E82fB676d4c935E601305E5253b3829dCD',
        network: 'mainnet',
        // provide abi OR overrideSimulationOpts.transactionData.data
        abi: JSON.stringify(contractABI),
      },
      title: 'Flash',
      description: 'Call the Flash() function',
      type: 'custom',
      metadata: {
        sendTo: '0xA91382E82fB676d4c935E601305E5253b3829dCD',
        sendValue: '10000000000000000',
        sendCurrency: {
          name: 'Ethereum',
          symbol: 'ETH',
          decimals: 18,
          type: 'native',
        },
      },
      functionInterface: { name: 'flash', inputs: [] },
      functionInputs: [],
      via: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      viaType: 'EOA',
    },
    // set simulate to true
    simulate: true,
    // optional
    overrideSimulationOpts: {
      transactionData: {
        // or instead of ABI, you can provide data
        data: '0xd336c82d',
      },
    },
  });

  console.log(`Created proposal (${proposalWithSimulation.proposalId})`);

  if (proposalWithSimulation.simulation.meta.reverted) {
    console.log(
      'Transaction reverted:',
      proposalWithSimulation.simulation.meta.returnString ?? proposalWithSimulation.simulation.meta.returnValue,
    );
  } else {
    console.log(proposalWithSimulation.simulation);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
