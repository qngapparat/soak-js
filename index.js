
const Amazon = require('./amazon');
const Google = require('./google');

module.exports = {
  Amazon: (() => require('./amazon'))(),
  Google: (() => require('./google'))()
}