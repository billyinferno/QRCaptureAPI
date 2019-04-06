function createResponse(res, status, message, pager) {
   return res.status(status).send({
      'status': status,
      'message': message,
      'pager': pager
   });
}

// export the createResponse function for global use
exports.createResponse = createResponse;