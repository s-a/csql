"use strict";

var ListCommands = function(controller) {
	this.controller = controller;	
	return this;
};

ListCommands.prototype.onDatabasesListed = function (/*res*/) {
	this.controller.silent = false;
};

ListCommands.prototype.run = function (/*argv*/) {
	this.controller.silent = false;
	this.controller.executeSQL("SELECT name FROM master.dbo.sysdatabases", this.onDatabasesListed.bind(this));
};

module.exports = ListCommands;