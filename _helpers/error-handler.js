module.exports = errorHandler;
const response = require("./response");

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return response.prepareResponseFromMsg(res, false, true, err, 200);
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return response.prepareResponseFromMsg(res, false, true, err.message, 400);
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return response.prepareResponseFromMsg(res, false, true, 'Invalid Token', 401);
    }

    // default to 500 server error
    return response.prepareResponseFromMsg(res, false, true, err.message, 500);
}