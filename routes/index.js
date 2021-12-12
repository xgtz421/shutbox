

/* GET home page. */
exports.list = function(req, res, next) {
  res.render('index', { title: 'Express' });
}