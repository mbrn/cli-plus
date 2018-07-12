
const open = require('open');
const _ = require('lodash');

module.exports = function(address) {
  if (_.startsWith(address, 'http') === false) {
    address = 'http://' + address;
  }
  open(address);
};
