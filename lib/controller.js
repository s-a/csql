"use strict";


var path = require("path");
var Log = require(path.join(__dirname, "log.js"));
var ProviderEvent = require(path.join(__dirname, "dbevent.js"));


var Controller = function(config) {
	this.log = new Log();
	this.config = config;
	var type = config.type.toLowerCase();
	var DB = require(path.join( __dirname, "provider." + type + ".js" ));
	this.db = new DB(this);
	this.db.connect();
	this.event = new ProviderEvent(this);

	this.db.connection.on("connect", this.connected.bind(this));
	this.db.connection.on("infoMessage", this.event.info.bind(this));
	this.db.connection.on("errorMessage", this.event.error.bind(this));
	this.db.connection.on("end", this.event.end.bind(this));
	this.db.connection.on("debug", this.event.debug.bind(this));
};


Controller.prototype.connected = function(err) {

	var self = this;
	if (err) {
		console.log(err);
		process.exit(1);
	}

	console.log("connected");

	process.stdin.resume();

	process.stdin.on("data", function (chunk) {
		self.db.execute.bind(self)(chunk);
	});

	process.stdin.on("end", function () {
		process.exit(0);
	});

};



module.exports = Controller;