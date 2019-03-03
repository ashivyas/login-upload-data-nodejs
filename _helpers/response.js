function prepareResponse(res, success, hasError, data, error, status) {
    return res.status(status).json({success : success, hasError : hasError, data : data, errors: error});
}

function prepareResponseFromMsg(res, success, hasError, msg, status) {
    var error = [];
    var data = [];
    console.log(msg);
    if(success && !hasError) {
        error = null;
        data.push(msg);
    }
    else if(hasError){
        data = null;
        error.push(msg);
    }
    prepareResponse(res, success, hasError, data, error, status);
}

function prepareResponseFromObj(res, obj, key) {
    var data = [];
    if(obj)
    if(obj instanceof Array) {
        var surveys = {};
        surveys[key] = obj;
        data.push(surveys);
    }else {
        data.push(obj);
    }
    prepareResponse(res, true, false, data, null, 200);  
}



module.exports = {
    prepareResponseFromObj,
    prepareResponseFromMsg
}