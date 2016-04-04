var DBEvent = function (controller) {
	this.controller = controller;
	return this;
};

DBEvent.prototype.requestDone = function(rowCount/*, more*/) {
	console.log(rowCount + " rows");
};

DBEvent.prototype.statementComplete = function(err, rowCount) {
	if (err) {
		console.log("Statement failed: " + err);
	} else {
		console.log(rowCount + " rows");
	}
};

DBEvent.prototype.end = function() {
	console.log("Connection closed");
	process.exit(0);
};

DBEvent.prototype.info = function(info) {
	console.log(info.number + " : " + info.message);
};

DBEvent.prototype.error = function(info) {
	this.log.error(info.number + " : " + info.message);
};

DBEvent.prototype.debug = function(message) {
	this.log.error(message);
};

DBEvent.prototype.columnMetadata = function(columnsMetadata) {
	columnsMetadata.forEach(function(column) {
		console.log(column);
	});
};

DBEvent.prototype.row = function(columns) {
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
};

module.exports = DBEvent;