var Router = require('restify-router').Router;
var routerInstance = new Router();
var Promise = require('promise');
var bookService = Promise.denodeify( require('./book-service'));;


module.exports = function(common) {
	var count=0;

    // add a route like you would on a restify server instance
    routerInstance.get('/', function respond(req, res, next) {
		console.log("request "+count++);
	    bookService.getName(function(name) {
            res.json(name);
        })
    });
    routerInstance.get('/test', function respond(req, res, next) {
        res.json(common.commonService.toUpper('test'));
    });

    return routerInstance;
}
