
const amazon = require('./amazon');
const google = require('./google');

function getExecutingPlatform(first = {}, second = {}, ...rest = []) {
  // get platform
  // on amazon, second param is 'context' and hsa these fields
  if (
    typeof second.invokedFunctionArn === 'string'
    && typeof second.functionName === 'string'
    && typeof second.awsRequestId === 'string'
  ) {
    return 'amazon'
  }

  if(
    typeof first.method === 'string'
    && first.get  // some methods that Express' Request objs alwys have
    && first.accepts 
    && first.acceptsCharsets
    && first.param
  ) {
    return 'google'
  }

  throw new Error("Couldn't recognize platform running this code, seems neither to be GC Functions nor Amazon Lambda");
}

module.exports = {
  getExecutingPlatform
}