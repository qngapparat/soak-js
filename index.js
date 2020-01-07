
const amazon = require('./amazon');
const google = require('./google');

/**
 * Given the original invocation arguments, detemines which platform we are on
 * @param {object} first 
 * @param {object} second 
 * @param  {...any} rest 
 */
function getExecutingPlatform(first, second, ...rest) {
  // get platform
  // on amazon, second param is 'context' and hsa these fields
  if (
    second &&
    typeof second.invokedFunctionArn === 'string'
    && typeof second.functionName === 'string'
    && typeof second.awsRequestId === 'string'
  ) {
    return 'amazon'
  }

  if (
    first &&
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

/**
 * 
 * @param {Function} func The userfunction to run
 * @param {SoakConfig} config Optional config
 */
function universalSoak(func, config = {}) {
  // kind of a function factory
  return (first, second, ...rest) => {
    const platform = getExecutingPlatform(first, second, ...rest)
    
    if (platform === 'google') {
      return google(func, config)(first, second, ...rest)
    }
    if(platform === 'amazon') {
      return amazon(func, config)(first, second, ...rest)
    }
    return `Support for ${platform} not implemented yet ://`
  }
 
}

module.exports = {
  universalSoak
}