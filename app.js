/* global process:true, __dirname:true */

'use strict';

var path = require('path'),
    restify = require('restify'),
    config = require('config'),
    glob = require('glob');

exports.createServer = createServer;


/*
 * Set up server
 * @return the created server
 */
function createServer(logger) {

    var settings = {
        name: (config.has('server.name') && config.get('server.name')) ? config.get('server.name') : require(path.join(__dirname, 'package')).name
    };

    if (logger) settings.log = logger;

    var server = restify.createServer(settings);

    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());

    server.on('NotFound', function(req, res, next) {
        if (logger) {
            logger.debug('404', 'No route that matches request for ' + req.url);
        }
        res.send(404, req.url + ' was not found');
    });

    if (logger) server.on('after', restify.auditLogger({
        log: logger
    }));

    //get the list of all routes files
    var files = glob.sync("*-routes.js", {
        matchBase: true,
        cwd: "modules"
    });

    var common=require('./modules/common')();
    console.log(common);

    //attach all routes to server
    files.forEach(function(file){
      console.log("/"+path.dirname(file))
      require('./modules/'+file)(common).applyRoutes(server, "/"+path.dirname(file));
    });

    return server;
}
