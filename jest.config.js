module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      diagnostics: true,
    },
  },
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
};
