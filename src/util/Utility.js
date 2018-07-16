module.exports = {
  moneyFormat: function(money, decimal = 0) {
    var re = '\\d(?=(\\d{' + (3) + '})+' + (decimal > 0 ? '\\D' : '$') + ')',
      num = money.toFixed(Math.max(0, ~~decimal));

    return num.replace('.', ',').replace(new RegExp(re, 'g'), '$&' + ('.'));
  }
};
