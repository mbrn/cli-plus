
const open = require("open");
const _ = require("lodash");
const dataManager = require('../../util/LocalDataManager');

module.exports = function (address) {
  if(_.startsWith(address, "http") == false) {
    address = "http://" + address
  }
  open(address);
}