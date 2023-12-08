import { reduceArtifactSize } from './deploy';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const artifact = require('../fixtures/Box.json');

describe('Deploy utilities', () => {
  it('reduceArtifactSize: only keeps the specified keys', () => {
    const reducedArtifact = reduceArtifactSize({
      artifactPayload: JSON.stringify(artifact),
      contractName: 'Box',
      contractPath: 'contracts/Box.sol',
    });

    expect(reducedArtifact).toEqual({
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
            },
          },
        },
      },
    });
  });

  it('reduceArtifactSize: big fixture', () => {
    const sizeBefore = JSON.stringify(artifact).length;

    const reducedArtifact = reduceArtifactSize({
      artifactPayload: JSON.stringify(artifact),
      contractName: 'Box',
      contractPath: 'contracts/Box.sol',
    });

    const sizeAfter = JSON.stringify(reducedArtifact).length;
    expect(sizeAfter).toBeLessThan(sizeBefore);
  });

  it('reduceArtifactSize: throws if contract not found', () => {
    expect(() => {
      reduceArtifactSize({
        artifactPayload: JSON.stringify(artifact),
        contractName: 'Box',
        contractPath: 'contracts/Box2.sol',
      });
    }).toThrow();
  });

  it('reduceArtifactSize: throws if artifact not found', () => {
    expect(() => {
      reduceArtifactSize({
        artifactPayload: JSON.stringify(artifact),
        contractName: 'Box',
        contractPath: 'contracts/Box2.sol',
      });
    }).toThrow();
  });

  it('reduceArtifactSize: throws if artifact is not valid json', () => {
    expect(() => {
      reduceArtifactSize({
        artifactPayload: 'invalid json',
        contractName: 'Box',
        contractPath: 'contracts/Box.sol',
      });
    }).toThrow();
  });
});
