var glob = require('glob');
var path = require('path');
var changeCase=require("change-case");

module.exports = function() {
    var files = glob.sync('*.js', {
        matchBase: true,
        cwd:'./modules/common',
        ignore: "index.js"
    });
console.log(files);
    var out = {};
    files.forEach(function(file) {
        var fileName = path.basename(file,".js");
        out[changeCase.camelCase(fileName)] = require("./"+file);
    })
    return out;
}
