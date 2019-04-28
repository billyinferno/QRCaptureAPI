////////////////////////////////////////////////////////////////////////////////
/// ./app/common/response.js                                                 ///
/// ------------------------------------------------------------------------ ///
/// this is a common function to create response status and message so all   ///
/// the response returned by the QR API Services has the same layout or      ///
/// structure to easier using QR API Services for front-end application.     ///
////////////////////////////////////////////////////////////////////////////////
function createResponse(res, status, message, pager) {
   return res.status(status).send({
      'status': status,
      'message': message,
      'pager': pager
   });
}

// export the createResponse function for global use
exports.createResponse = createResponse;