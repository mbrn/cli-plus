const chalk = require('chalk');
const https = require('https');
const _ = require('lodash');
const dataManager = require('../../util/LocalDataManager');

module.exports = function(command, stock) {
  if (!command) {
    command = 'show';
  }

  if (commands[command]) {
    commands[command](stock);
  }
};

const itemsKey = 'stockList';
var commands = {
  show: function() {
    var stockList = dataManager.get(itemsKey);
    if (!stockList || stockList.length === 0) {
      console.log('No stock added. Please type ' + chalk.green('x stc add STOCK_NAME') + ' to add new stock to list');
      return;
    }

    getStocksData(stockList, data => {
      console.log('STOCK  LATEST C.RATE   LOW    HIGH');
      console.log('=====  ====== ======  ====== ======');

      data.forEach(stock => {
        const f = stock.change_rate > 0 ? chalk.green : chalk.red;

        var line =
          _.padEnd(stock.ticker, 6, ' ') + ' ' +
          _.padEnd(stock.latest, 6, ' ') + ' ' +
          '%' + _.padEnd(stock.change_rate, 6, ' ') + ' ' +
          _.padEnd(stock.lowest, 6, ' ') + ' ' +
          _.padEnd(stock.highest, 6, ' ');

        console.log(f(line));
      });
    });
  },

  list: function() {
    var stockList = dataManager.get(itemsKey);
    if (!stockList || stockList.length === 0) {
      console.log('No stock added. Please type ' + chalk.green('x stc add STOCK_NAME') + ' to add new stock to list');
      return;
    }

    stockList.sort().forEach(element => {
      console.log(element);
    });

    console.log();
    console.log('Total ' + stockList.length + ' stocks listed');
  },

  add: function(stock) {
    if (!stock) {
      console.log('Please specify a stock name after add command');
      return;
    }

    var stockList = dataManager.get(itemsKey) || [];
    stockList.push(stock);

    dataManager.set(itemsKey, stockList);
  },

  remove: function(stock) {
    var stockList = dataManager.get(itemsKey);
    if (!stockList || stockList.length === 0) {
      console.log('No stock added. Please type ' + chalk.green('x stc add STOCK_NAME') + ' to add new stock to list');
      return;
    }

    const indexOf = stockList.indexOf(stock);
    if (indexOf === -1) {
      console.log(chalk.yellow('WARNING: ' + stock + ' not found to remove'));
    } else {
      stockList.splice(indexOf, 1);
      dataManager.set(itemsKey, stockList);
      console.log(chalk.green(stock + ' removed.'));
    }
  }
};

function getStocksData(filterStocks, callBack) {
  var url = 'https://www.doviz.com/api/v1/stocks/all/latest';

  https.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      var data = JSON.parse(body);
      data = data.filter(a => (filterStocks.indexOf(a.ticker) !== -1)).sort((a, b) => { return (a.ticker > b.ticker) ? 1 : ((b.ticker > a.ticker) ? -1 : 0) });
      callBack(data);
    });
  }).on('error', function(e) {
    console.log('Got an error: ', e);
  });
}
