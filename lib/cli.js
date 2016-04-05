#!/usr/bin/env node

"use strict";

var path = require("path");
var home = process.env.home || process.env.userprofile;
var config = require(path.join(home, "config.csql.json"));
var Controller = require(path.join(__dirname, "controller.js"));
var controller = new Controller(config);

controller.db.connect();