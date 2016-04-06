"use strict";

var DBEvent = function (controller) {
	this.controller = controller;
	return this;
};

DBEvent.prototype.requestDone = function(rowCount/*, more*/) {
	this.log.info(rowCount + " rows"); 
};

DBEvent.prototype.statementComplete = function(err, rowCount) {
	if (err) {
		this.log.error("Statement failed: " + err);
	} else {
		this.log.info(rowCount + " rows");
		if (this.done){
			this.done({meta: this.meta, data: this.data});
		}
	}
};

DBEvent.prototype.end = function() {
	this.log.error("Connection closed");
	process.exit(0);
};

DBEvent.prototype.info = function(info) {
	this.log.info(info.number + " : " + info.message);
};

DBEvent.prototype.error = function(info) {
	this.log.error(info.number + " : " + info.message);
};

DBEvent.prototype.debug = function(message) {
	this.log.info(message);
};

DBEvent.prototype.columnMetadata = function(columnsMetadata) {
	this.meta = columnsMetadata;
};

DBEvent.prototype.row = function(columns) {
	if (!this.silent){		
		var values = "";

		columns.forEach(function(column) {
			var value;
			if (column.value === null) {
				value = "NULL";
			} else {
				value = column.value;
			}

			values += value + "\t";
		});

		console.log(values);
	}
	this.data.push(columns);
};

module.exports = DBEvent;