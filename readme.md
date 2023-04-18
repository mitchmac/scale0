# Scale0
Serverless WordPress on Vercel or Netlify

## Usage
```
npm i scale0
```

Then in your project's function directory use Scale0 in a file like api/index.js:

```
const path = require('path');
const scale0 = require('scale0');

exports.handler = async function (event, context, callback) {
    const pathToWP = path.join(process.cwd(), 'wp');

    return await scale0({docRoot: pathToWP, event: event});
}
```

Where

* docRoot is the path to WordPress files
* event is the serverless event data from Vercel or Netlify
