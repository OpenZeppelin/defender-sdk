const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  const store = Defender.localKVStoreClient({ path: './store.json' });
  await store.put('key', 'value!');

  const value = await store.get('key');
  console.log(value);

  await store.del('key');
}

if (require.main === module) {
  main().catch(console.error);
}
