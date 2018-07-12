var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');


module.exports = {
  set: function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  get: function(key) {
    return JSON.parse(localStorage.getItem(key));
  }
}