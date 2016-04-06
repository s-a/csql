"use strict";

var Connection = require("tedious").Connection;
var Request = require("tedious").Request;

var MSSQL = function(controller) {
	this.controller = controller;
};

MSSQL.prototype.connect = function() {
	this.connection = new Connection(this.controller.config);
};

MSSQL.prototype.execute = function(sql, done) {
	var request = new Request(sql.toString(), this.event.statementComplete.bind(this))
	request.on("columnMetadata", this.event.columnMetadata.bind(this));
	request.on("row", this.event.row.bind(this));
	request.on("done", this.event.requestDone.bind(this));
	this.meta = {};
	this.data = [];
	this.done = done;
	this.db.connection.execSql(request);
};

module.exports = MSSQL;