function parseFiele(field) {
    return field;
}

function getField(req, field) {
    return req.body[field];
}

exports.required = function(field) {
    return function(req, res, next) {
        if (getField(req, field)) {
            next();
        } else {
            res.error(`${field} is required`);
            res.redirect('back');
        }
    }
};

exports.lengthAbove = function(field, len) {
    return function(req, res, next) {
        if (getField(req, field).length > len) {
            res.error(`${field} must have more than ${len} characters`);
            res.redirect('back');
        } else {
            next();
        }
    }
}