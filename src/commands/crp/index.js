const chalk = require('chalk');
const https = require('https');
const _ = require('lodash');

module.exports = function (options) {
  getData(options, function(data) {    
    data.forEach(element => {
      const f = element.quotes.USD.percent_change_24h > 0 ? chalk.green : chalk.red

      var line = 
        _.padEnd(element.symbol, 6, ' ') + ' ' + 
        f(_.padEnd(element.quotes.USD.price, 10, ' ')) + ' ' + 
        f(_.padEnd(element.quotes.USD.percent_change_24h, 6, ' ')) + ' ' + 
        _.padEnd(element.quotes.BTC.price, 13, ' ');

      console.log(line);
    });
  });  
}

function getData(options, callBack) {
  var url = 'https://api.coinmarketcap.com/v2/ticker/?convert=BTC&limit=';
  url += options.count;

  https.get(url, function(res){
      var body = '';

      res.on('data', function(chunk){
          body += chunk;
      });

      res.on('end', function(){
          var data = JSON.parse(body);
          var lst = []
          for(var c in data.data){
            lst.push(data.data[c]);
          }
          lst = lst.sort((a, b) => a.rank - b.rank);

          callBack(lst);
      });
  }).on('error', function(e){
        console.log("Got an error: ", e);
  });
}

