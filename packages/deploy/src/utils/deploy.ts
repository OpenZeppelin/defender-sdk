import { Artifact, ContractArtifact, RequestArtifact } from '../models';

export function reduceArtifactSize(req: RequestArtifact): Artifact | undefined {
  const { artifactPayload: artifact, contractName: name, contractPath: path } = req;
  if (!artifact) return undefined;

  const artifactObj = JSON.parse(artifact);

  const contract: ContractArtifact | undefined = artifactObj.output.contracts[path]?.[name];
  if (!contract) throw new Error(`Contract ${name} not found in artifact ${artifact}`);

  const source = artifactObj.input.sources[path];
  const settings = artifactObj.input.settings;
  if (!source) throw new Error(`Contract ${name} source not found in artifact ${artifact}`);
  if (!settings) throw new Error(`Contract ${name} settings not found in artifact ${artifact}`);

  return {
    input: {
      sources: {
        [path]: source,
      },
      settings,
    },
    metadata: contract.metadata,
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
            metadata: contract.metadata,
          },
        },
      },
    },
  };
}
