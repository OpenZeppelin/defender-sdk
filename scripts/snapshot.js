const path = require('path');
const { exec, getExecOutput } = require('@actions/exec');

const { version } = require('../package.json');
const tag = `${version}`;

process.chdir(path.join(__dirname, '..'));

(async () => {
  const { exitCode, stderr } = await getExecOutput(
    `git`,
    ['ls-remote', '--exit-code', 'origin', '--tags', `refs/tags/${tag}`],
    {
      ignoreReturnCode: true,
    },
  );
  if (exitCode === 0) {
    console.log(`Action is not being published because version ${tag} is already published`);
    return;
  }
  if (exitCode !== 2) {
    throw new Error(`git ls-remote exited with ${exitCode}:\n${stderr}`);
  }

  await exec('changeset', ['publish', '--no-git-tag', '--tag', 'rc-snapshot']);
})();
