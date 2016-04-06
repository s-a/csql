"use strict";

var Command = function(controller) {
	this.controller = controller;	
	return this;
};
 
Command.prototype.run = function (/*argv*/) {
    var self = this;
	this.controller.executeSQL("SELECT name FROM master.dbo.sysdatabases order by name asc", function(){
        self.controller.inputResume();
    });
};

module.exports = Command;