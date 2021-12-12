var redis = require('redis');
var bcrypt = require('bcrypt');
const { devNull } = require('os');
var db = redis.createClient();

db.on('ready',function(err){
    console.log('ready');
});

module.exports = User;

function User(obj) {
    for(var key in obj) {
        this[key] = `${obj[key]}`;  // 合并值
    }
}

User.prototype.save = function(fn) {
    if (this.id) {
        this.update(fn);
    } else {
        var user = this;
        db.incr('user:ids', function(err, id) {
            if (err) return fn(err);
            user.id = `${id}`;
            user.hashPassword(function (err) {
                if (err) return fn(err);
                user.update(fn);
            });
        })
    }
};

User.prototype.update = function(fn) {
    var user = this;
    var id = user.id;
    db.set(`user:id:${user.name}`, id, (err) => {
        if (err) return fn(err);
        db.hmset(`user:${id}`, user, (err) => {
            fn(err);
        });
    });
};

User.prototype.hashPassword = function(fn) {
    var user = this;
    bcrypt.genSalt(12, (err, salt) => {
        if (err) return fn(err);
        user.salt = salt; // 将生成的盐保存
        bcrypt.hash(user.pass, salt, function(err, hash) {
            if (err) return fn(err);
            user.pass = hash; // 将密码替换成哈希值
            fn();
        });
    });
};

User.getId = (name, fn) => {
    db.get(`user:id:${name}`, fn);
}

User.getByName = (name, fn) => {
    User.getId(name, (err, id) => {
        if (err) return fn(err);
        User.get(id, fn);
    })
}

User.get = (id, fn) => {
    db.hgetall(`user:${id}`, (err, user) => {
        if (err) return fn(err);
        fn(null, new User(user));
    });
}

User.authenticate = (name, pass, cb) => {
    User.getByName(name, (err, user) => {
        if (err) return cb(err);
        if (!user.id) return cb();
        bcrypt.hash(pass, user.salt, (err, hash) => {
            if (err) return cb(err);
            if (hash === user.pass) {
                return cb(null, user);
            }
            return cb();
        })
    })
}

User.prototype.toJSON =function() {
    return {
        id: this.id,
        name: this.name
    }
}
// var tobi = new User({
//     name: 'Tobi',
//     pass: 'ferret',
//     age: 2
// });

// tobi.save((err) => {
//     if(err) throw err;
//     console.log('user id %d', tobi.id);
// });