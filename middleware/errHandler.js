const errHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case 400:
      res.json({
        title: "valideation err",
        message: err.msg,
        stackTrace: err.stack,
      });
      break;

    default:
      res.json({ title: "err", message: err.msg, stackTrace: err.stack });

      break;
  }
};
module.exports = errHandler;
