var Connection = require("tedious").Connection;
var Request = require("tedious").Request;

var MSSQL = function(config) {
	this.config = config;
};

MSSQL.prototype.connect = function() {
	this.connection = new Connection(this.config);
};

MSSQL.prototype.execute = function(sql) {
	var request = new Request(sql.toString(), this.event.statementComplete)
	request.on("columnMetadata", this.event.columnMetadata);
	request.on("row", this.event.row);
	request.on("done", this.event.requestDone);

	this.controller.db.connection.execSql(this.request);
};


module.exports = MSSQL;