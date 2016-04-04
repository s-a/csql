var winston = require('winston');
var colors = require('colors/safe');
var path = require("path");

var LOG = function(/*config*/) {
	this.fs = new (winston.Logger)({
		transports: [
			new (winston.transports.File)({
				name: 'info-file',
				filename: path.join(process.env.home, "log.csql.info.txt"),
				level: 'info'
			}),
			new (winston.transports.File)({
				name: 'error-file',
				filename: path.join(process.env.home, "log.csql.error.txt"),
				level: 'error'
			})
		]
	});
};


LOG.prototype.error = function(msg) {
	console.log( colors.bgRed.white(msg) );
	this.fs.error(msg);
};

LOG.prototype.info = function(msg) {
	console.log( colors.yellow(msg) );
	this.fs.info(msg);
};

module.exports = LOG;