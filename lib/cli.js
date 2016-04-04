#!/usr/bin/env node


var Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var path = require("path");
var fs = require("fs");
var config = require(path.join(process.env.home, "config.csql.json"));
var connection = new Connection(config);

connection.on("connect", connected);
connection.on("infoMessage", infoError);
connection.on("errorMessage", infoError);
connection.on("end", end);
connection.on("debug", debug);

var LOG = require(path.join(__dirname, "log.js"));
var log = new LOG();

var Controller = require(path.join(__dirname, "controller.js"));
var controller = new Controller();



function connected(err) {
	if (err) {
		console.log(err);
		process.exit(1);
	}

	//console.log("connected");
	log.error("connected");

	process.stdin.resume();

	process.stdin.on("data", function (chunk) {
		exec(chunk);
	});

	process.stdin.on("end", function () {
		process.exit(0);
	});
}

function exec(sql) {
	sql = sql.toString();

	request = new Request(sql, statementComplete)
	request.on("columnMetadata", columnMetadata);
	request.on("row", row);
	request.on("done", requestDone);

	connection.execSql(request);
}

function requestDone(rowCount, more) {
  //console.log(rowCount + " rows");
}

function statementComplete(err, rowCount) {
	if (err) {
		console.log("Statement failed: " + err);
	} else {
		console.log(rowCount + " rows");
	}
}

function end() {
	console.log("Connection closed");
	process.exit(0);
}

function infoError(info) {
	console.log(info.number + " : " + info.message);
}

function debug(message) {
	//console.log(message);
}

function columnMetadata(columnsMetadata) {
	columnsMetadata.forEach(function(column) {
		console.log(column);
	});
}

function row(columns) {
	var values = "";

	columns.forEach(function(column) {
		if (column.value === null) {
			value = "NULL";
		} else {
			value = column.value;
		}

		values += value + "\t";
	});

	console.log(values);
}