
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
 * @param {any} first First function invocation arg
 * @param {any} second Second invocation arg
 * @param  {...any} [rest] Rest of invocation args
 */
function universalSoak(func, config = {}) {
  // think of this as a function factory
  // depending on platform ...
  // ... run userfunc with a different hydration wrapper (Google cloud storage, aws, ...)
  const platform = getExecutingPlatform(first, second, ...rest)
  if (platform === 'google') {
    // to be precise, (req, res) => ...
    return (...args) => google(...args)
  }
  // to be precise, (event, context, callback) => ...
  if (platform === 'amazon') {
    return (...args) => amazon(...args)
  }

  // else
  return `Support for ${platform} not implemented yet ://`
}

module.exports = {
  universalSoak
}