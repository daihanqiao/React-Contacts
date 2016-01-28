'use strict';
var fs = require('fs');
var files;
var walk = function(path, handleFile){
    files = fs.readdirSync(path);
    files.forEach(function(item) {
        var tmpPath = path + '/' + item;
        var stats = fs.statSync(tmpPath);
        if (stats.isDirectory()) {
            if(item === '.svn'){
                return false;
            }
            walk(tmpPath,handleFile);
        } else {
            handleFile(tmpPath,stats);
        }
    });
};
module.exports = walk;
