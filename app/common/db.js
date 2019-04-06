//////////////////////////////////////////////////////////
/// connect to mysql DB
//////////////////////////////////////////////////////////
'user strict';

const mysql  = require('mysql');
const util   = require('util');

// configuration for local mysql connection
var connPoll = mysql.createPool({
   connectionLimit: config.dbConnectionLimit,
   host: config.dbHost,
   user: config.dbUser,
   password: config.dbPassword,
   database: config.dbName
});

connPoll.getConnection((err, conn) => {
   if (err) {
      switch(err.code) {
         case 'PROTOCOL_CONNECTION_LOST':
            console.error('(ERROR) ' + err.errno + ' : Database connection was closed.');
            break;
         case 'ER_CON_COUNT_ERROR':
            console.error('(ERROR) ' + err.errno + ' : Too many connection to database.');
            break;
         case 'ECONNREFUSED':
            console.error('(ERROR) ' + err.errno + ' : Connection to DB refused.');
            break;
         default:
            console.error('(ERROR) ' + err.errno + ' : ' + err.message);
            break;
      }
      throw err;
   }
   else {
      console.log("Connected to MySQL database...");
   }
});

connPoll.query = util.promisify(connPoll.query);

// export the mysql connection that we created
module.exports = connPoll;