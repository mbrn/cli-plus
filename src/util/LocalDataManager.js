var process = require('process');
var path = require('path');
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage(path.join(process.argv[1], '../scratch'));

module.exports = {
  set: function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  get: function(key) {
    return JSON.parse(localStorage.getItem(key));
  }
};
