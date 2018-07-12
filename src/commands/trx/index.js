const translate = require('google-translate-api');

module.exports = function(term, options) {
  var langs = options.language.split('-');

  translate(term, {from: langs[0], to: langs[1]}).then(res => {
    console.log(res.text);
    if (res.from.text.autoCorrected) {
      console.log(res.from.text.value);
    }
  }).catch(err => {
    console.error(err);
  });
};
