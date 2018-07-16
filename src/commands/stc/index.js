const chalk = require('chalk');
const https = require('https');
const _ = require('lodash');
const dataManager = require('../../util/LocalDataManager');
const Utility = require('../../util/Utility');

module.exports = function(command, stock, count) {
  if (!command) {
    command = 'show';
  }

  if (commands[command]) {
    commands[command](stock, count);
  }
};

const itemsKey = 'stockList';
var commands = {
  show: function() {
    var stockList = dataManager.get(itemsKey);
    if (!stockList || stockList.length === 0) {
      console.log('No stock added. Please type ' + chalk.green('x stc add STOCK_NAME COUNT') + ' to add new stock to list');
      return;
    }
    console.log();

    var total = 0;
    getStocksData(stockList.map(e => { return e.stock }), data => {
      console.log('STOCK  LATEST  C.RATE   LOW     HIGH   COUNT    TRY');
      console.log('=====  ======  ======  ======  ======  =====  =======');

      data.forEach(stock => {
        const f = stock.change_rate > 0 ? chalk.green : chalk.red;
        const count = stockList.find(e => { return e.stock === stock.ticker }).count;
        const stockTotal = Math.round(count * stock.latest);
        total += stockTotal;

        var line =
          _.padEnd(stock.ticker, 6, ' ') + ' ' +
          _.padStart(stock.latest, 6, ' ') + '  ' +
          _.padStart('%' + stock.change_rate, 6, ' ') + '  ' +
          _.padStart(stock.lowest, 6, ' ') + '  ' +
          _.padStart(stock.highest, 6, ' ') + '  ' +
          _.padStart(count, 5, ' ') + '  ' +
          _.padStart(Utility.moneyFormat(stockTotal), 7, ' ');
          // _.padStart(stockTotal, 7, ' ');

        console.log(f(line));
      });
      console.log('=====  ======  ======  ======  ======  =====  =======');
      console.log(_.padStart(Utility.moneyFormat(total), 53, ' '));
    });
  },

  list: function() {
    var stockList = dataManager.get(itemsKey);
    if (!stockList || stockList.length === 0) {
      console.log('No stock added. Please type ' + chalk.green('x stc add STOCK_NAME COUNT') + ' to add new stock to list');
      return;
    }

    stockList.sort().forEach(element => {
      console.log(element.stock + ' ' + element.count);
    });

    console.log();
    console.log('Total ' + stockList.length + ' stocks listed');
  },

  add: function(stock, count) {
    if (!stock) {
      console.log('Please specify a stock name after add command');
      return;
    }
    count = count || 0;
    var stockList = dataManager.get(itemsKey) || [];

    const indexOf = stockList.map(function(e) { return e.stock }).indexOf(stock);
    if (indexOf !== -1) {
      stockList.splice(indexOf, 1);
    }

    stockList.push({ stock, count });
    dataManager.set(itemsKey, stockList);
  },

  remove: function(stock) {
    var stockList = dataManager.get(itemsKey);
    if (!stockList || stockList.length === 0) {
      console.log('No stock added. Please type ' + chalk.green('x stc add STOCK_NAME COUNT') + ' to add new stock to list');
      return;
    }

    const indexOf = stockList.map(function(e) { return e.stock }).indexOf(stock);
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
