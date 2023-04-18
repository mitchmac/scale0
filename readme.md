# Scale0
Serverless WordPress on Vercel or Netlify

Just want to get started?

Try the [WordPress starter project](https://github.com/mitchmac/scale0-wordpress-starter)!

| Netlify | Vercel |
| --- | --- |
| [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/mitchmac/scale0-wordpress-starter) |[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmitchmac%2Fscale0-wordpress-starter) |


## Overview
Scale0 includes PHP 8.1 with common extensions and libraries required by WordPress to run in the Serverless function Node.js runtimes of Vercel and Netlify.

## Usage
```
npm i scale0
```

Then in your project's function directory use Scale0 in a file like api/index.js:

```javascript
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
