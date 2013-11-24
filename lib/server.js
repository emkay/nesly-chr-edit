var http = require('http');
var domain = require('domain');

var listener = require('./request-listener');
var bunyan = require('bunyan');

var options = { name: 'chr-editor',
        level: process.env.LOG_LEVEL || 'info',
        serializers: bunyan.stdSerializers
    };

var logger = bunyan.createLogger(options);

var server = http.createServer(function (req, res) {
    var d = domain.create();
    server = this;

    d.on('error', function(err) {
        throw err;
    });

    d.add(req);
    d.add(res);

    d.run(function () {
        listener.call(server, req, res);
    });
});

server.logger = logger;
module.exports = server;
