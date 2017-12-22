const util = require('util');
exports.setError = function setError(toClientResponse, msg = "", error) {
    toClientResponse.statusCode = 600;
    toClientResponse.hasContent = true;
    toClientResponse.stopRunAction = true;
    toClientResponse.sendedToClient = false;
    toClientResponse.body = msg + "\n\n" + (error && error.message) + "\n\n" + util.inspect(error);
};