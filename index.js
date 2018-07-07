#!/usr/bin/env node

const program = require('commander');
const packageJson = require("./package.json");
const go = require("./src/commands/go");
 
program.version(packageJson.version);
program.command("go <address>").action(function(address) { go(address) })  



program.parse(process.argv);