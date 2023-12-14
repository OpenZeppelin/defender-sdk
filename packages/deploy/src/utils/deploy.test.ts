import { extractArtifact } from './deploy';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const artifact = require('../fixtures/Box.json');

describe('Deploy utilities', () => {
  it('extractArtifact: only keeps the specified keys', () => {
    const reducedArtifact = extractArtifact({
      artifactPayload: JSON.stringify(artifact),
      contractName: 'Box',
      contractPath: 'contracts/Box.sol',
    });

    expect(reducedArtifact).toEqual({
      input: {
        sources: {
          'contracts/Box.sol': {
            content: artifact.input.sources['contracts/Box.sol'].content,
          },
        },
        settings: artifact.input.settings,
      },
      output: {
        contracts: {
          'contracts/Box.sol': {
            Box: {
              abi: artifact.output.contracts['contracts/Box.sol'].Box.abi,
              evm: {
                bytecode: {
                  object: artifact.output.contracts['contracts/Box.sol'].Box.evm.bytecode.object,
                  linkReferences: artifact.output.contracts['contracts/Box.sol'].Box.evm.bytecode.linkReferences,
                },
              },
              metadata: artifact.output.contracts['contracts/Box.sol'].Box.metadata,
            },
          },
        },
      },
    });
  });

  it('extractArtifact: reduces the original size', () => {
    const sizeBefore = JSON.stringify(artifact).length;

    const reducedArtifact = extractArtifact({
      artifactPayload: JSON.stringify(artifact),
      contractName: 'Box',
      contractPath: 'contracts/Box.sol',
    });

    const sizeAfter = JSON.stringify(reducedArtifact).length;
    expect(sizeAfter).toBeLessThan(sizeBefore);
  });

  it('extractArtifact: throws if contract not found', () => {
    expect(() => {
      extractArtifact({
        artifactPayload: JSON.stringify(artifact),
        contractName: 'Box',
        contractPath: 'contracts/Box2.sol',
      });
    }).toThrow();
  });

  it('extractArtifact: throws if artifact not found', () => {
    expect(() => {
      extractArtifact({
        artifactPayload: JSON.stringify(artifact),
        contractName: 'Box',
        contractPath: 'contracts/Box2.sol',
      });
    }).toThrow();
  });

  it('extractArtifact: throws if artifact is not valid json', () => {
    expect(() => {
      extractArtifact({
        artifactPayload: 'invalid json',
        contractName: 'Box',
        contractPath: 'contracts/Box.sol',
      });
    }).toThrow();
  });
});
