#!/usr/bin/env node

"use strict";

var path = require("path");
var Controller = require(path.join(__dirname, "controller.js"));
var QA = require(path.join(__dirname, "qa.js"))
var qa = new QA();

var onConnectionSelected = function(connectionConfiguration){
    var controller = new Controller(connectionConfiguration);
    controller.db.connect();
};

console.log(qa.encrypt("test"))
;
qa.begin(onConnectionSelected);