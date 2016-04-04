#!/usr/bin/env node

var path = require("path");
var config = require(path.join(process.env.home, "config.csql.json"));
var Controller = require(path.join(__dirname, "controller.js"));
var controller = new Controller(config);
controller.db.connect();