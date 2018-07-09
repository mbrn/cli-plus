const chalk = require('chalk');
const https = require('https');
const _ = require('lodash');

module.exports = function (options) {
  getExcData(options, function(excData) {    
    getGoldData(options, function(goldData) {

      var data = excData.concat(goldData);
      data.forEach(element => {
        const rate = Math.round(element.change_rate * 100) / 100
        const f = rate > 0 ? chalk.green : chalk.red

        var line = 
          _.padEnd(element.code || element.short_name, 6, ' ') + ' ' + 
          f(_.padEnd(element.selling.toString().substring(0, 6), 7, ' ')) + ' ' + 
          f('%' + _.padEnd(rate, 5, ' '));        

        console.log(line);
      });
    });
  });  
}

function getExcData(options, callBack) {
  var url = 'https://www.doviz.com/api/v1/currencies/all/latest';

  https.get(url, function(res){
      var body = '';

      res.on('data', function(chunk){
          body += chunk;
      });

      res.on('end', function(){
          var data = JSON.parse(body);
          data = data.filter(a => (["USD", "EUR", "GBP"].indexOf(a.code) != -1));
          callBack(data);
      });
  }).on('error', function(e){
        console.log("Got an error: ", e);
  });
}

function getGoldData(options, callBack) {
  var url = 'https://www.doviz.com/api/v1/golds/all/latest';

  https.get(url, function(res){
      var body = '';

      res.on('data', function(chunk){
          body += chunk;
      });

      res.on('end', function(){
          var data = JSON.parse(body);
          data = data.filter(a => (["Gram", "Ons", "Çeyrek"].indexOf(a.short_name) != -1));
          callBack(data);
      });
  }).on('error', function(e){
        console.log("Got an error: ", e);
  });
}

