const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'packages', 'base', 'src', 'utils', 'network.ts');
let fileContent = fs.readFileSync(filePath, 'utf8');

// Function to sort networks
const sortNetworks = (networksString) => {
  return networksString
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') || line.startsWith("'"))
    .sort((a, b) => a.localeCompare(b))
    .join('\n');
};

const sortChainIds = (chainIdsString) => {
  const chainIdsLines = chainIdsString.split('\n');
  const chainIdsEntries = chainIdsLines
    .map((line) => line.trim().match(/'([^']+)': (\d+|0x[a-fA-F\d]+)/))
    .filter(Boolean);
  const sortedChainIdsEntries = chainIdsEntries.sort((a, b) => a[1].localeCompare(b[1]));
  return sortedChainIdsEntries.map((entry) => `  '${entry[1]}': ${entry[2]},`).join('\n');
};

// Regex patterns for different network types and the Networks array
const publicNetworkRegex = /export type PublicNetwork =\n([\s\S]*?);/;
const customNetworkRegex = /export type CustomNetwork =\n([\s\S]*?);/;
const networksArrayRegex = /export const Networks: Network\[\] = \[\n([\s\S]*?)\n\];/;
const chainIdsRegex = /const chainIds: { \[key in Network\]: number } = {\n([\s\S]*?)\n};/;

// Sort PublicNetwork
const publicMatches = fileContent.match(publicNetworkRegex);
if (publicMatches && publicMatches[1]) {
  const sortedPublicNetworks = sortNetworks(publicMatches[1]);
  fileContent = fileContent.replace(publicNetworkRegex, `export type PublicNetwork =\n${sortedPublicNetworks};`);
}

// Sort CustomNetwork
const customMatches = fileContent.match(customNetworkRegex);
if (customMatches && customMatches[1]) {
  const sortedCustomNetworks = sortNetworks(customMatches[1]);
  fileContent = fileContent.replace(customNetworkRegex, `export type CustomNetwork =\n${sortedCustomNetworks};`);
}

// Sort Networks array
const networksMatches = fileContent.match(networksArrayRegex);
if (networksMatches && networksMatches[1]) {
  console.log(networksMatches[1]);
  const sortedNetworksArray = sortNetworks(networksMatches[1])
    .split('\n')
    .map((line) => `\t${line}`) // Reformat to match array item style
    .join('\n');
  fileContent = fileContent.replace(
    networksArrayRegex,
    `export const Networks: Network[] = [\n${sortedNetworksArray}\n];`,
  );
}

// Sort chainIds
const chainIdsMatches = fileContent.match(chainIdsRegex);
if (chainIdsMatches && chainIdsMatches[1]) {
  const sortedChainIds = sortChainIds(chainIdsMatches[1]);
  fileContent = fileContent.replace(
    chainIdsRegex,
    `const chainIds: { [key in Network]: number } = {\n${sortedChainIds}\n};`,
  );
}

// Write the modified content back to the file
fs.writeFileSync(filePath, fileContent);
console.log('All networks sorted successfully.');
