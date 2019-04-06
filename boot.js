/// Node JS
/// QR Server API
/// v.0.0.1
//////////////////////////////////////////////////////////
/// I Gede Adi Martha Ardiana
/// billytheburninginferno@gmail.com
//////////////////////////////////////////////////////////

// export all needed modules
express          = module.exports = require('express');
bodyParser       = module.exports = require('body-parser');
expressValidator = module.exports = require('express-validator');
jwt              = module.exports = require('jsonwebtoken');
path             = module.exports = require('path');
fs               = module.exports = require('fs');
rfs              = module.exports = require('rotating-file-stream');
uuid             = module.exports = require('uuid');
config           = module.exports = require('./app/common/config');

// create server and port that will be assigned to the server
var server = express();
var db     = require('./app/common/db');
var resp   = require('./app/common/response');
const port = process.env.PORT || 8099;

// assign body parser to express
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// use express validator for the server
server.use(expressValidator());

// set the logger format
if(config.logEnabled) {
   var logger = require('morgan');
   server.use(logger('[:date] (:method) (:url) (:status) : content-length=:res[content-length] - from=:remote-addr - resp-time=:response-time ms'));
}

// insert the routes for this server here
require('./app/routes/routes')(server, db, resp);

// listen to port 8099
server.listen(port, console.log("Server is listening at: " + port));

// exports the server so it can be use by other instance
exports.module = server;

// now load the routes that we will serve on the API
console.log(".... s t a r t e d ....");
