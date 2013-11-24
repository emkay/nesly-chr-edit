module.exports = listener;

function listener(req, res) {
    var server = this;
    var reqID = require('crypto').randomBytes(6).toString('hex');
    var wants = require('req-wants');
    
    req.wants = wants;
    res.setHeader('x-request-id', reqID);

    req.log = res.log = server.logger.child({ 'request-id': reqID });
    req.log.info({ req: req })

    // res is a writable stream and has a finish event, use to to log the res
    res.on('finish', function(){
        req.log.info({ res: res });
    })

    var EP = require('error-page');
    var erropts = { 404: 'not found',
            415: 'unsupported media type',
            '*': error,
            log: function(){} // the error-page logger is kinda useless, noop it.
    };

    res.error = EP(req, res, erropts);

    var path = require('path'),
        beardo = require('beardo'),
        beardopts = { directory: path.resolve(__dirname, '../templates') };

      res.template = beardo(req, res, beardopts)


    res.json = function (json, status, headers){
        var data = JSON.stringify(json);
        var headers = headers || {};

        headers['content-type'] = headers['content-type'] || 'application/json'

        res.send(data, status, headers)
    };

    var buffer = require('buffer').Buffer

    res.send = function (data, status, headers) {
        var data = data || '';
        var status = status || res.statusCode;
        var headers = headers || {};
        var data = Buffer.isBuffer(data) ? data : new Buffer(data);

        res.statusCode = status;

        Object.keys(headers).forEach(function (key) {
            res.setHeader(key, headers[key]);
        });

        res.setHeader('content-length', data.length);
        res.end(data);
    }
        
    var url = require('url');
    var pathname = url.parse(req.url).pathname;
    var router = require('./router');
    var route = router.match(pathname);

    // Merge the route's keys to the request object
    if (route) Object.keys(route).forEach(function (k){ req[k] = route[k] });

    // has route?
    if (!route) return res.error(404);
    else route.fn(req, res)

    // this has to happen after the routing in order to detect that the right
    // listeners have been added
    if (req.listeners('json').length && req.is('json')) {
        var concat = require('concat-stream');

        req.pipe(concat(function (buffer) {
            var data = buffer.toString();
            var json;

            try { json = JSON.parse(data); }
            catch (err) { return res.error(400, 'You sent some bad JSON :('); }

            req.emit('json', json);
        }));
    }

    if (req.listeners('form').length && req.is('form')) {
        var concat = require('concat-stream');
        var qs = require('qs');

        req.pipe(concat(function (buffer) {
            req.emit('form', qs.parse(buffer.toString()));
        }));
    }
}

// the default error handler passed to error-page
function error(req, res, data){
    if (data.code >= 500) {
        // something real bad happened here.
    }

    req.log.error({ err: data.error });

    var json = { mesage: data.error ? data.error.message: data.message,
        status: data.code,
        'request-id': res.getHeader('x-request-id'),
        url: req.url
    }

    res.json(json, data.code);
}
