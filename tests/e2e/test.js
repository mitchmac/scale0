const scale0 = require('./src/index');
const path = require('path');

exports.handler = async function (event, context, callback) {
    const docRoot = path.join(process.cwd(), 'wp');
  
    const response = await scale0({event: event, docRoot: docRoot});
   
    return response;
};