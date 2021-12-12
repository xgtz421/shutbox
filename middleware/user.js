var User = require('../lib/user');

module.exports = function(req, res, next) {
    if (req.remoteUser) {
        res.locals.user = req.remoteUser;
        console.log('*********req.remoteUser:', req.remoteUser);
    }
    var uid = req.session.uid;
    if (!uid) return next();
    User.get(uid, (err, user) => {
        if (err) return next(err);
        req.user = res.locals.user = user;
        next();
    });
}