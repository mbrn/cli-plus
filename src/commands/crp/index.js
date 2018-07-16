const chalk = require('chalk');
const https = require('https');
const _ = require('lodash');
const dataManager = require('../../util/LocalDataManager');
const Utility = require('../../util/Utility');

module.exports = function(command, coin, count) {
  if (!command) {
    command = 'show';
  }

  if (commands[command]) {
    commands[command](coin, count);
  } else {
    console.error(command + ' command found!');
  }
};

const itemsKey = 'cryptoList';
var commands = {
  show: function() {
    var coinList = dataManager.get(itemsKey);
    if (!coinList || coinList.length === 0) {
      console.log('No coin added. Please type ' + chalk.green('x crp add COIN_SYMBOL') + ' to add new coin to list');
      return;
    }
    console.log();

    var usdTry = getUsdTryPrice();
    usdTry = (usdTry.selling + usdTry.buying) / 2;
    console.log('USD/TRY: ' + usdTry);
    console.log();

    getCryptoData(coinList.map(e => { return e.coin }), data => {
      console.log('RANK  CUR.      USD         BTC          TRY      C.RATE   COUNT    USD     BTC     TRY ');
      console.log('====  =====  =========  ============  ==========  =======  =====  =======  =====  =======');

      var usdTotal = 0;
      var btcTotal = 0;
      var tryTotal = 0;

      data.forEach(coin => {
        const f = coin.quotes.USD.percent_change_24h > 0 ? chalk.green : chalk.red;
        const count = coinList.find(e => { return e.coin === coin.symbol }).count;
        const usdPrice = count * coin.quotes.USD.price;
        const btcPrice = count * coin.quotes.BTC.price;
        const tryPrice = Math.round(count * coin.quotes.USD.price * usdTry);

        usdTotal += usdPrice;
        btcTotal += btcPrice;
        tryTotal += tryPrice;

        var line =
          _.padStart(coin.rank, 4, ' ') + '  ' +
          _.padEnd(coin.symbol, 6, ' ') +
          _.padStart(Utility.moneyFormat(coin.quotes.USD.price, 2), 10, ' ') + ' ' +
          _.padStart(coin.quotes.BTC.price, 13, ' ') + '  ' +
          _.padStart(Utility.moneyFormat(coin.quotes.USD.price * usdTry, 2), 10, ' ') + ' ' +
          _.padStart('%' + coin.quotes.USD.percent_change_24h, 8, ' ') + ' ' +
          _.padStart(count, 6, ' ') + '  ' +
          _.padStart(Utility.moneyFormat(usdPrice), 7, ' ') + '  ' +
          _.padStart(Utility.moneyFormat(btcPrice, 2), 5, ' ') + '  ' +
          _.padStart(Utility.moneyFormat(tryPrice), 7, ' ');

        console.log(f(line));
      });

      const totalLine =
        'TOTAL                                                             ' +
        _.padStart(Utility.moneyFormat(usdTotal), 7, ' ') + '  ' +
        _.padStart(Utility.moneyFormat(btcTotal, 2), 5, ' ') + '  ' +
        _.padStart(Utility.moneyFormat(tryTotal), 7, ' ');
        console.log('====  =====  =========  ============  ==========  =======  =====  =======  =====  =======');
        console.log(totalLine);
    });
  },

  list: function() {
    var coinList = dataManager.get(itemsKey);
    if (!coinList || coinList.length === 0) {
      console.log('No coin added. Please type ' + chalk.green('x crp add coin_SYMBOL') + ' to add new coin to list');
      return;
    }

    coinList.sort().forEach(element => {
      console.log(element.coin + ' ' + element.count);
    });

    console.log();
    console.log('Total ' + coinList.length + ' currencies listed');
  },

  add: function(coin, count) {
    if (!coin) {
      console.log('Please specify a coin name after add command');
      return;
    }

    count = count || 0;
    var coinList = dataManager.get(itemsKey) || [];

    const indexOf = coinList.map(function(e) { return e.coin }).indexOf(coin);
    if (indexOf !== -1) {
      coinList.splice(indexOf, 1);
    }

    coinList.push({ coin, count });
    dataManager.set(itemsKey, coinList);
  },

  remove: function(coin) {
    var coinList = dataManager.get(itemsKey);
    if (!coinList || coinList.length === 0) {
      console.log('No coin added. Please type ' + chalk.green('x crp add COIN_SYMBOL') + ' to add new coin to list');
      return;
    }

    const indexOf = coinList.map(function(e) { return e.coin }).indexOf(coin);
    if (indexOf === -1) {
      console.log(chalk.yellow('WARNING: ' + coin + ' not found to remove'));
    } else {
      coinList.splice(indexOf, 1);
      dataManager.set(itemsKey, coinList);
      console.log(chalk.green(coin + ' removed.'));
    }
  }
};

function getCryptoData(filterCurrencies, callBack) {
  var url = 'https://api.coinmarketcap.com/v2/ticker/?convert=BTC';

  https.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      var data = JSON.parse(body);
      var lst = [];
      for (var c in data.data) {
        if (filterCurrencies.indexOf(data.data[c].symbol) !== -1) {
          lst.push(data.data[c]);
        }
      }

      lst = lst.sort((a, b) => { return a.rank - b.rank });
      callBack(lst);
    });
  }).on('error', function(e) {
    console.log('Got an error: ', e);
  });
}

function getUsdTryPrice() {
  const url = 'https://www.doviz.com/api/v1/currencies/USD/latest';

  var request = require('sync-request');
  var result = request('GET', url).body.toString('utf-8');
  return JSON.parse(result);
}
