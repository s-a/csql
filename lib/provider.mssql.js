var Connection = require("tedious").Connection;
var Request = require("tedious").Request;

var MSSQL = function(controller) {
	this.controller = controller;
};

MSSQL.prototype.connect = function() {
	this.connection = new Connection(this.controller.config);
};

MSSQL.prototype.execute = function(sql) {
	var request = new Request(sql.toString(), this.event.statementComplete.bind(this))
	request.on("columnMetadata", this.event.columnMetadata);
	request.on("row", this.event.row);
	request.on("done", this.event.requestDone);
	this.db.connection.execSql(request);
};

module.exports = MSSQL;