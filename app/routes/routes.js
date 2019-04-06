// routes/routes.js

const qrRoutes = require('./qr.routes');

module.exports = function(server, db, resp) {
   console.log("This is Main Routes...");
   server.get('/v.1.0/echo', ({}, res) => {
      // this is echo message for everybody who come to this API restful
      res.status(200).json({sucess: true});
   });

   // call the qr routes
   qrRoutes(server, db, resp);
};