"use strict";

var fs = require("fs");
var glob = require("glob");
var path = require("path");
var crypto = require('crypto');
var inquirer = require("inquirer");
var home = process.env.home || process.env.userprofile;

var QA = function() {
	return this;	
}

QA.prototype.encrypt = function(text){
  var cipher = crypto.createCipher('aes-256-ctr', "d6F3Efeq")
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
};
 
QA.prototype.decrypt = function(text){
  var decipher = crypto.createDecipher('aes-256-ctr', "d6F3Efeq")
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
};

QA.prototype.getConfigurationsFromFilesystem = function() {
	var files = glob.sync( path.join(home, "csql.config.*.json"));
	var result = [];
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		var fn = path.basename(file).replace("csql.config.", "").replace(".json","");
		result.push(fn);
	}
	return result;
};

QA.prototype.getInstalledProviders = function() {
	var files = glob.sync( path.join(__dirname, "provider.*.js"));
	var result = [];
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		var fn = path.basename(file).replace("provider.", "").replace(".js","");
		result.push(fn.toUpperCase());
	}
	return result;
};

QA.prototype.writeConfigurationsToFilesystem = function(cfg) {
	var filename = path.join(home, "csql.config." + cfg.name + ".json");
	var configuration = {
		"type" : cfg.type,
		"server" : cfg.server,
		"userName" : cfg.username,
		"password" : this.encrypt(cfg.password, cfg.username),
		"options" : {
			"port" : cfg.port,
			"data": true,
			"payload": false,
			"token": false,
			"packet": true,
			"log": true
		}
	};

	fs.writeFileSync(filename, JSON.stringify(configuration, null, 4));

};




QA.prototype.newConnection = function(defaultNewConnectionName, done) {
	
	
	var self = this;
	
	inquirer.prompt([{
		type: "input",
		message: "What' s the connection name?",
		name: "key",
		default : defaultNewConnectionName		
	}], function( name ) {

		inquirer.prompt([{
			type: "list",
			message: "Choose a connection type",
			name: "key",
			choices: self.getInstalledProviders()
		}], function( type ) {
			inquirer.prompt([{
				type: "input",
				message: "server?",
				default : "127.0.0.1",
				name: "key"
			}], function( server ) {
				inquirer.prompt([{
					type: "input",
					message: "port?",
					name: "key",
					default : "1433"
				}], function( port ) {
					inquirer.prompt([{
						type: "input",
						message: "username?",
						default : "dba",
						name: "key"
					}], function( username ) {
						inquirer.prompt([{
							type: "password",
							message: "password?",
							name: "key"
						}], function( password ) {
							self.writeConfigurationsToFilesystem({name:name.key, type:type.key, server:server.key, port:port.key, username:username.key, password:password.key});
							var config = self.openConfig(name.key);
							done(config);
						});
					});
				});
				
			});
			
		});

	});
	
};


QA.prototype.openConfig = function(name) {
	var configFilename = path.join(home, "csql.config." + name + ".json");
	var config = require(configFilename);
	config.password = this.decrypt(config.password, config.username);	
	config.filename = configFilename;	
	return config;
};

QA.prototype.begin = function(done) {

	var self = this;
	var choices =  [
		"New connection",
		new inquirer.Separator()
	];

	var installedConfigurations = this.getConfigurationsFromFilesystem();
	Array.prototype.push.apply(choices, installedConfigurations);
	
	inquirer.prompt([{
		type: "list",
		message: "Choose a connection",
		name: "key",
		choices: choices
	}], function( answers ) {
		if (answers.key === "New connection"){
			self.newConnection("New connection (" + (installedConfigurations.length + 1) + ")", done)
		} else {
			var config = self.openConfig(answers.key);
			done(config);
		}
	});
	
};

module.exports = QA;