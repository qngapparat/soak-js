
const amazon = require('./amazon');
const google = require('./google');
const { getExecutingPlatform  } = require('./utils');

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

module.exports = universalSoak;