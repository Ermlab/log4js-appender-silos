log4js appender for http://silos.ermlab.com


Installation:

    npm install log4js
    npm install log4js-appender-silos

Usage:

    var log4js = require('log4js');
    var appender = 'log4js-appender-silos';
    var token = 'your-silos-token';

    log4js.loadAppender(appender);
    log4js.addAppender(log4js.appenders[appender](token));

    var logger = log4js.getLogger('your-logger-name');

    logger.info('Node server started on ', new Date());
