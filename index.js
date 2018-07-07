#!/usr/bin/env node

const program = require('commander');
const packageJson = require("./package.json");
const go = require("./src/commands/go");
const search = require("./src/commands/search");
 
program.version(packageJson.version);

program.command("go <address>").action(function(address) { go(address) })

program
  .command("search <term>")
  .option('-b, --browser', false)
  .option('-c, --count <n>', "result count", 5, parseInt)
  .option('-s, --skip <n>', "result count", 0, parseInt)
  .action(function(term, options) { search(term, options) })



program.parse(process.argv);