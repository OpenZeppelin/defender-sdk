# Defender Code Inspector Client

Defender Code Inspector Client allows you to trigger analysis runs from any environment.
Code Inspector dives into a detailed examination, identifying potential vulnerabilities and suggesting improvements to enhance your code quality. It generates a succinct report, summarizable in your PR comments for quick and immediate access, while a more detailed report is made available on Defender.


## Usage

Start by creating a new _Team API Key_ in Defender, and granting it the capability to manage code inspector runs. Use the newly created API key to initialize an instance of Defender client.

```js
const { Defender } = require('@openzeppelin/defender-sdk');
const client = Defender({ apiKey: API_KEY, apiSecret: API_SECRET });
```

### Trigger Analysis run

TODO