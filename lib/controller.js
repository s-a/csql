"use strict";

var fs = require("fs");
var path = require("path");
var Log = require(path.join(__dirname, "log.js"));
var ProviderEvent = require(path.join(__dirname, "dbevent.js"));
var minimist = require('minimist');


var Controller = function(config) {
    this.home = process.env.home || process.env.userprofile;
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

Controller.prototype.executeProviderModuleCommand = function(commandString) {
	commandString = commandString.substr(1);
    var providerType = this.config.type.toLowerCase();
	var parsedCommandString = commandString.toString().split("-"); 
    var cmdName = parsedCommandString[0].trim();
    var args = [];
    var vargs = {};
    
    if (parsedCommandString.length > 1){
        parsedCommandString.shift();
        parsedCommandString = "-" + parsedCommandString.join(" -");
        args = parsedCommandString.split(" ");
        vargs = minimist(args);
        vargs.__ = parsedCommandString;
    }
    
	var cmdFilename = path.join(__dirname, "command." + providerType + "." + cmdName + ".js");
    
    if (fs.existsSync(cmdFilename)){        
        var Command = require(cmdFilename);
        var command = new Command(this);
        command.run(vargs);
    } else {
        this.log.error("command not found");
    }
};

Controller.prototype.executeSQL = function(sql, done) {
	this.done = done;
	return this.db.execute.bind(this)(sql, done);
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
		chunk = chunk.toString();
		if (chunk.substring(0,1) === ":"){
			self.executeProviderModuleCommand(chunk.replace("\n", "").replace("\r", ""));
		} else {
			self.db.execute.bind(self)(chunk);
		}
	});

	process.stdin.on("end", function () {
		process.exit(0);
	});

};



module.exports = Controller;