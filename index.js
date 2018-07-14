#!/usr/bin/env node

const program = require('commander');
const packageJson = require('./package.json');
const exc = require('./src/commands/exc');
const crp = require('./src/commands/crp');
const go = require('./src/commands/go');
const src = require('./src/commands/src');
const stc = require('./src/commands/stc');
const trx = require('./src/commands/trx');

program.version(packageJson.version);

program
  .command('exc').action(function(options) { exc(options) });

program
  .command('crp [command] [coin] [count]')
  .action(function(command, coin, count) { crp(command, coin, count) });

program.command('go <address>').action(function(address) { go(address) });

program
  .command('src <term>')
  .option('-b, --browser', false)
  .option('-c, --count <n>', 'result count', 5, parseInt)
  .option('-s, --skip <n>', 'result count', 0, parseInt)
  .action(function(term, options) { src(term, options) });

program
  .command('stc [command] [stock]')
  .action(function(command, stock) { stc(command, stock) });

program
  .command('trx <term>')
  .option('-l --language <s>', 'translation languages', 'en-tr')
  .action(function(term, options) { trx(term, options) });

program.parse(process.argv);
