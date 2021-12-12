module.exports = function(fn, prepage) {
    prepage = prepage || 10;
    return function(req, res, next) {
        var page = Math.max(parseInt(req.params['page'] || '1', 10), 1) -1;
        console.log('**********req.params:', req.params);
        if (Number.isInteger(page)) {
            fn(function(err, total) {
                if (err) return next(err);
                console.log('************total:', total);
                req.page = res.locals.page = {
                    number: page,
                    prepage: prepage,
                    from: page* prepage,
                    to: page* prepage + prepage -1,
                    total: total,
                    count: Math.ceil(total/prepage),
                };
                
                console.log('********** req.page:', req.page);
                next();
            });
        }
    }
};