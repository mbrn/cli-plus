

module.exports = function (term, options) {

  options.count = parseInt(options.count)
  options.skip = parseInt(options.skip)

  if(options.browser) {
    const open = require("open");    
    const querystring = require('querystring');

    const searchTerm = querystring.stringify({q: term});
    const url = "https://google.com/search?" + searchTerm;

    open(url);
  }
  else{
    var google = require('google');
    const chalk = require("chalk");
  
    google.resultsPerPage = 25
    var nextCounter = 0
    var totalCounter = options.count;
    var skip = options.skip;
    
    google(term, function (err, res){
      if (err) console.error(err)
            
      for (var i = 0; i < res.links.length; ++i) {
        var link = res.links[i];
        if(totalCounter && link && link.href) {
          if(skip) { 
            skip--; 
            continue;
          }
          totalCounter--;
          console.log(chalk.bold.green(link.title) + " " + chalk.gray(link.href))
          console.log(link.description + "\n")
        }
      }
    
      if (totalCounter > 0) {
        nextCounter += 1
        if (res.next) res.next()
      }
    })
  }
}