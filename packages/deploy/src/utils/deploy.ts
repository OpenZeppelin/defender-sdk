import { Artifact, ContractArtifact, DeployContractRequest, RequestArtifact } from '../models';

export function reduceArtifactSize(req: RequestArtifact): Artifact | undefined {
  const { artifactPayload: artifact, contractName: name, contractPath: path } = req;
  if (!artifact) return undefined;

  const artifactObj = JSON.parse(artifact);

  const contract: ContractArtifact | undefined = artifactObj.output.contracts[path]?.[name];
  if (!contract) throw new Error(`Contract ${name} not found in artifact ${artifact}`);

  return {
    output: {
      contracts: {
        [path]: {
          [name]: {
            abi: contract.abi,
            evm: {
              bytecode: {
                object: contract.evm.bytecode.object,
                linkReferences: contract.evm.bytecode.linkReferences,
              },
            },
          },
        },
      },
    },
  };
}
