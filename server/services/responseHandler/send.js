const badRequest = require("../responseHandler/badRequest");
const dbError = require("../responseHandler/dbError");
const internalError = require("../responseHandler/internalError");
const unAuthorized = require("../responseHandler/unAuthorized");
const conflict = require("../responseHandler/conflict");
const ok = require("../responseHandler/ok");
const create = require("../responseHandler/create");
const notFound = require("./notFound");

module.exports = (req, res, next) => {
  res["Ok"] = ok;
  res["create"] = create;
  res["BadRequest"] = badRequest;
  res["DbError"] = dbError;
  res["InternalError"] = internalError;
  res["UnAuthorized"] = unAuthorized;
  res["Conflict"] = conflict;
  res["NotFound"] = notFound
  next();
};
