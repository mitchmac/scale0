const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs').promises;

const waitOn = require('wait-on');
const fetch = require('node-fetch');
const isBinaryFile = require("isbinaryfile").isBinaryFile;

let php;
let serverReady = false;

const libPath = path.resolve(__dirname, '../php-files/lib');
const phpPath = path.resolve(__dirname, '../php-files/php');
const phpIniPath = path.resolve(__dirname, '../php-files/php.ini');
const cwd = path.resolve(__dirname, '../php-files');

async function handler(data) {
    await validate(data);

    const { event, docRoot } = data;

    if (!php) {
        const env = {
            ...process.env,
            LD_LIBRARY_PATH: `${libPath}:${process.env['LD_LIBRARY_PATH']}`
        };

        //@TODO: configurable php.ini path
        const phpArgs = ['-S', '127.0.0.1:8000', '-t', docRoot, '-c', phpIniPath];

        php = spawn(phpPath, phpArgs, {
            env: env,
            cwd: cwd
        });

        php.stdout.on('data', data => {
            console.log(data.toString());
        });
    
        php.on('error', function (err) {
            console.log.error(err);
        });

        php.stderr.on('data', data => {
            console.log(data.toString());
        });
    }

    try {
        if (!serverReady) {
            const waitOnOpts = {
                resources: [
                    'tcp:127.0.0.1:8000'
                ],
                interval: 5, // poll interval in ms
                timeout: 9000, // timeout in ms
            };
            await waitOn(waitOnOpts);
            serverReady = true;
        }

        // Netlify: event.rawQuery
        // Vercel: query string is included with event.path
        let queryString = '';
        if (event.rawQuery) {
            queryString = `?${event.rawQuery}`;
        }

        let body = '';
        if (event.body) {
            if (event.isBase64Encoded) {
              body = Buffer.from(event.body, 'base64');
            }
            else {
              body = event.body;
            }
        }

        const url = `http://127.0.0.1:8000${event.path}${queryString}`;
        
        let fetchOpts = {
          method: event.httpMethod,
          headers: event.headers,
          redirect: 'manual',
          compress: false
        };

        if (body) {
            fetchOpts.body = body;
        }

        const response = await fetch(url, fetchOpts);

        let headers = {};
        for (const [key, value] of Object.entries(response.headers.raw())) {
          if (key !== 'set-cookie') {
            headers[key] = value[0];
          }
        }

        let multiHeaders = {};
        if (response.headers.raw()['set-cookie']) {
            if (process.env['VERCEL']) {
                headers['set-cookie'] = response.headers.raw()['set-cookie'];
            }
            else {
                multiHeaders['set-cookie'] = response.headers.raw()['set-cookie'];
            }
          }
        
        const responseBuffer = await response.arrayBuffer();

        let base64Encoded = false;
        let responseBody;

        const isBin = await isBinaryFile(responseBuffer);
        if (isBin) {
          responseBody = Buffer.from(responseBuffer).toString('base64');
          base64Encoded = true;
        }
        else {
          responseBody = Buffer.from(responseBuffer).toString('utf8');
        }

        if (headers['location']) {
          if (headers['location'].indexOf('http://127.0.0.1:8000') !== -1) {
            headers['location'] = headers['location'].replace('http://127.0.0.1:8000', '');
          }
        }

        let returnResponse = {
          statusCode: response.status || 200,
          headers: headers,
          body: responseBody,
          isBase64Encoded: base64Encoded
        };

        if (multiHeaders['set-cookie']) {
            returnResponse.multiValueHeaders = multiHeaders;
        }

        return returnResponse;
    }
    catch (err) {
        console.log(err);
    }

    return {
        statusCode: 500,
        body: 'There was a problem, check your function logs for clues.'
    }
}

async function validate(data) {
    if (!data.hasOwnProperty("event")) {
        throw new Error("The event property is required.");
    }
    else if (!data.event) {
        throw new Error("The event property cannot be empty.");
    }

    if (!data.hasOwnProperty("docRoot")) {
        throw new Error("The docRoot property is required.");
    }

    const docRootExists = await exists(data.docRoot);
    if (!docRootExists) {
      throw new Error("The docRoot property is not a valid path.");
    }
}

async function exists(path) {
    try {
      await fs.access(path);
      return true;
    } catch (error) {
      return false;
    }
}

module.exports = handler;
module.exports.validate = validate;