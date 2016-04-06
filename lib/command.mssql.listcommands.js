"use strict";

var ListCommands = function(controller) {
	this.controller = controller;	
	return this;
};

ListCommands.prototype.onDatabasesListed = function (res) {
	console.log("ok", res);
	this.controller.silent = false;
};

ListCommands.prototype.run = function (parms) {
	console.log("list", parms);
	this.controller.silent = true;
	this.controller.executeSQL("SELECT name FROM master.dbo.sysdatabases", this.onDatabasesListed.bind(this));
};

module.exports = ListCommands; 