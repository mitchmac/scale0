const scale0 = require('./src/index');
const path = require('path');

exports.handler = async function (event, context, callback) {
    const docRoot = path.join(process.cwd(), 'wp');
    const routerScript = path.join(process.cwd(), 'router.php');
  
    const response = await scale0({event: event, docRoot: docRoot, routerScript: routerScript});
   
    return response;
};