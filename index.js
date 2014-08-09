// REF:
// https://github.com/nomiddlename/log4js-node/blob/master/lib/appenders/file.js

var querystring = require('querystring');
var http = require('http');


function silosAppender(token, host, port) {
    if (typeof host === 'undefined') {
        host = "silos.ermlab.com";
    }
    if (typeof port === 'undefined') {
        port = "80";
    }

    var queue = [];

    var sendNext = function () {
        if (queue.length == 0) return;

        var data = queue.shift();


        var options = {
            host: host,
            port: port,
            path: '/api/call/' + token,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        var req = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                sendNext();
            });
        });
        req.write(data);
        req.end();
    }

    return function (loggingEvent) {
        var data = querystring.stringify({
            logger: loggingEvent.logger.category,
            body: JSON.stringify(loggingEvent.data),
            level: loggingEvent.level.level
        });
        queue.push(data);
        sendNext();
    };
}

function configure(config, options) {
    // console.log('appsilosAppender config', config, options);
}

function shutdown(cb) {
    // console.log('silos appender shutdown', cb);
}

exports.appender = silosAppender;
exports.configure = configure;
exports.shutdown = shutdown;