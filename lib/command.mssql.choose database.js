"use strict";


var inquirer = require("inquirer");

var Command = function(controller) {
	this.controller = controller;	
	return this;
};

Command.prototype.onDatabasesListed = function (res) {
    var self = this;
	
    
	var choices =  [
        "Cancel",
		new inquirer.Separator()
    ];

    for (var index = 0; index < res.data.length; index++) {
        var element = res.data[index];
        choices.push(element[0].value);
    }
	
    
	inquirer.prompt([{
		type: "list",
		message: "Choose a database",
		name: "key",
		choices: choices
	}], function( answers ) {
        if (answers.key === "Cancel"){
            self.controller.inputResume();
        } else {
            self.controller.silent = false;
            var sql = "use " + answers.key;
		    self.controller.log.info(sql);
            self.controller.executeSQL(sql, function () {
                self.controller.inputResume();
            });
        }
	});
	
};

Command.prototype.run = function (/*argv*/) {
	this.controller.silent = true;
	this.controller.executeSQL("SELECT name FROM master.dbo.sysdatabases order by name asc", this.onDatabasesListed.bind(this));
};

module.exports = Command;