var server = require('./lib/server'),
    port = process.env.PORT || 8080,
    host = process.env.HOST || 'localhost';

server.on('close', function () {
    server.logger.warn('Server closing');
});

server.listen(port, host, function () {
    var url = require('url');
    var formatted = url.format({ protocol: 'http',
                        hostname: host,
                        port: server.address().port
                    });
    server.logger.info('Server is running at: %s', formatted);
});
