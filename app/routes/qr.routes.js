// routes/qr.route.js
var route_name = "QR";

module.exports = function(server, db, resp) {;
   console.log("this is QR route");

   // list all the QR data that stored in table
   server.get('/v.1.0/' + route_name, ({}, res) => {
      db.query("SELECT qr_id, qr_title, qr_data, qr_timestamp, qr_username FROM qr ORDER BY qr_timestamp DESC", (err, result) => {
         if(err) {
            resp.createResponse(res, 500, err.message, {});
         }
         else {
            resp.createResponse(res, 200, result, {});
         }
      });
   });

   server.get('/v.1.0/' + route_name + '/limit/:qr_limit/page/:qr_page', (req, res) => {
      // for limit, there are 2 variable that need to be defined on the body
      // limit -> which limit the QR number that we will display
      // page  -> which is the page of QR data that we will display
      var qr_limit = req.params.qr_limit;
      var qr_page  = req.params.qr_page;

      // check if both qr_limit and qr_page is being set on the body message or not?
      if (typeof qr_limit === 'undefined' || typeof qr_page === 'undefined') {
         resp.createResponse(res, 500, "Missing mandatory fields on the message.", {});
      }
      else {
         // compute the offset of the query, to knew the offset we can perform
         // (qr_page - 1) * qr_limit computation.
         var qr_offset = (qr_page - 1) * qr_limit;
         var sqlQuery = "SELECT qr_id, qr_title, qr_data, qr_timestamp, qr_username FROM qr ORDER BY qr_timestamp DESC LIMIT " + qr_offset + ", " + qr_limit;
         db.query(sqlQuery, (err, result) => {
            if(err) {
               resp.createResponse(res, 500, err.message, qr_page);
            }
            else {
               if(result.length <= 0) {
                  // no data was given by the query, return 404
                  resp.createResponse(res, 404, "Exceed the maximum page of the QR data.", qr_page);
               }
               else {
                  resp.createResponse(res, 200, result, qr_page);
               }
            }
         });
      }
   });

   server.get('/v.1.0/'+route_name+'/id/:qr_id', (req, res) => {
      var qr_id = req.params.qr_id;
      if (typeof qr_id === 'undefined') {
         resp.createResponse(res, 500, "qr_id fields is not being defined.", {});
      }
      else {
         // now try to get the QR data from the table
         var sqlQuery = "SELECT qr_title, qr_data, qr_timestamp, qr_username FROM qr WHERE qr_id = ?";
         var sqlData = [qr_id];
         db.query(sqlQuery, sqlData, (err, result) => {
            if(err) {
               resp.createResponse(res, 500, err.message, {});
            }
            else {
               // check how many result we got, if we got = 0 result, it means that the ID
               // give is wrong.
               if(result.length <= 0) {
                  // no data was given by the query, return 404
                  resp.createResponse(res, 404, "QR ID " + qr_id + " is not found in database.", {});
               }
               else {
                  resp.createResponse(res, 200, result, {});
               }
            }
         });
      }
   });

   server.get('/v.1.0/'+route_name+'/numOfPage/limit/:qr_limit', (req, res) => {
      // for computing the num of pages, we need to knew, how many record that will be displayed
      // by the front-end application in one page.
      var qr_limit = req.params.qr_limit;
      if (typeof qr_limit === 'undefined') {
         resp.createResponse(res, 500, "Missing qr_limit fields on the message.", {});
      }
      else {
         if (qr_limit > 0) {            
            db.query("SELECT COUNT(*) as qr_total FROM qr", (err, result) => {
               if(err) {
                  resp.createResponse(res, 500, err.message, {});
               }
               else {
                  // get the QR total number from database
                  var json_array = JSON.parse(JSON.stringify(result));
                  var json_result = json_array[0];
                  var qr_total = json_result.qr_total;
   
                  // once we got the QR total data, then we can compute the number of pages that
                  // will be needed to display all the QR.
                  var qr_page_mod = qr_total % qr_limit;
                  var qr_page_used = Math.floor(qr_total / qr_limit);
                  var qr_page = qr_page_used;
                  if (qr_page_mod > 0) {
                     qr_page = qr_page + 1;
                  }
                  var res_result = [{"qr_page": qr_page}]; 
                  resp.createResponse(res, 200, res_result, {});
               }
            });
         }
         else {
            // user inserted 0 on the limit
            resp.createResponse(res, 500, "qr_limit should be more than 0.", {});
         }
      }
   });

   server.post('/v.1.0/'+route_name, (req, res) => {
      // check whether request contain all the body
      var qr_title    = req.body.qr_title;
      var qr_data     = req.body.qr_data;
      var qr_username = req.body.qr_username;
      if (typeof qr_title    === 'undefined' ||
          typeof qr_data     === 'undefined' ||
          typeof qr_username === 'undefined') {
         resp.createResponse(res, 500, "Missing mandatory fields.", {});
      }
      else {
         // all data is being filled, now create the query for insert the data into QR table.
         var qr_uuid = uuid.v4();
         var sqlQuery = "INSERT INTO qr(qr_id, qr_title, qr_data, qr_username) VALUES(?, ?, ?, ?)";
         var sqlData = [qr_uuid, qr_title, qr_data, qr_username];
         db.query(sqlQuery, sqlData, (err, result) => {
            if(err) {
               resp.createResponse(res, 500, err.message, {});
            }
            else {
               var json_result = result;
               var sqlAffectedRows = json_result.affectedRows;
               if(sqlAffectedRows > 0) {
                  var qr_response = {"result":"Record is successfuly added.", "qr_id":qr_uuid};
                  resp.createResponse(res, 200, qr_response, {});
               }
               else {
                  resp.createResponse(res, 500, "Failed to insert record to database.", {})
               }
            }
         });
      }
   });

   server.patch('/v.1.0/'+route_name+'/id/:qr_id', (req, res) => {
      var qr_id = req.params.qr_id;
      if (typeof qr_id === 'undefined') {
         resp.createResponse(res, 500, "qr_id fields is not being defined.", {});
      }
      else {
         res.send('update QR data');
      }
   });

   server.delete('/v.1.0/'+route_name+'/id/:qr_id', (req, res) => {
      var qr_id = req.params.qr_id;
      if (typeof qr_id === 'undefined') {
         resp.createResponse(res, 500, "qr_id fields is not being defined.", {});
      }
      else {
         // now try to get the QR data from the table
         var sqlQuery = "DELETE FROM qr WHERE qr_id = ?";
         var sqlData = [qr_id];
         db.query(sqlQuery, sqlData, (err, result) => {
            if(err) {
               resp.createResponse(res, 500, err.message, {});
            }
            else {
               // check the affected rows of the result
               var json_result = result;
               var sqlAffectedRows = json_result.affectedRows;
               if(sqlAffectedRows > 0) {
                  resp.createResponse(res, 200, "Record with ID " + qr_id + " is successfuly deleted.", {});
               }
               else {
                  resp.createResponse(res, 404, "No record found with ID " + qr_id + ".", {})
               }
            }
         });
      }
   });

};