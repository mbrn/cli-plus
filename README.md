# cli-plus

[![Build Status](https://travis-ci.org/mbrn/cli-plus.svg?branch=master)](https://travis-ci.org/mbrn/cli-plus)
[![npm package](https://img.shields.io/npm/v/cli-plus/latest.svg)](https://www.npmjs.com/package/cli-plus)
[![NPM Downloads](https://img.shields.io/npm/dm/cli-plus.svg?style=flat)](https://npmcharts.com/compare/cli-plus?minimal=true)
[![Install Size](https://packagephobia.now.sh/badge?p=cli-plus)](https://packagephobia.now.sh/result?p=cli-plus)
[![Follow on Twitter](https://img.shields.io/twitter/follow/baranmehmet.svg?label=follow+baranmehmet)](https://twitter.com/baranmehmet)

A console application that contains a lof of features to help developer

## Installation
    $ npm install cli-plus --save -g

## Commands
Every command starts with "x " prefix. 

### crp
    $ x crp         # lists top 10 crypto currency prices
    $ x crp -c 5    # lists top 5 crypto currency prices

### go
    $ x go medium.com/@mehmet.baran
   
### src
    $ x src news
    $ x src "search something on google"                # results will be on console   
    $ x src "search somethinh on google" -c 10          # result count 10 (default 5)
    $ x src "search somethinh on google" -c 10 -s 10    # result count 10 and skip first 10 result   
    $ x src "search something on google" -b             # results will be on browser 
   
### trx
    $ x trx car
    $ x trx araba -l tr-en  # translate araba from Turkish to English (default translation en-tr)
