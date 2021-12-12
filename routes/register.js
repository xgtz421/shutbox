var User = require('../lib/user');

exports.form = (req, res, next)=> {
    res.render('register', { title: 'Register' });
};

exports.submit = (req, res, next) => {
    var data = req.body;
    console.log('***********req.body:', req.body);
    
    User.getByName(data.name, function(err, user) {
        if (err) return next(err);

        if (user.id) {
            res.error('Username already taken!');
            res.redirect('back');
        } else {
            user = new User({
                name: data.name,
                pass: data.pass,
            });
            user.save(function (err) {
                if (err) return next(err);
                console.log('********redirect*******')
                req.session.uid = user.id;
                res.redirect('/');
            });
        }
    })
}
 
