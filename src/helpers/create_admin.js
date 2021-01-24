const User = require('../models/User');
const _p = require('../helpers/simpleasync');
const hash = require('./password_hash');

//create user
(async () => {
    const [error, admin] = await _p(User.findOne({ email: "admin@gmail.com" }));
    if (!admin) {
        const hashPass = await hash.new('admin');
        const userInfo = {
            name: "Admin",
            email: "admin@gmail.com",
            password: hashPass,
            type: "admin",
            status: "active"
        }
        const [error, saveUserInfo] = await _p(User.create(userInfo));

        if (!error) {
            console.log('admin user created');
            return;
        } else {
            console.log(error.message);
            return;
        }
    }
    if (error) console.log(error.message);

    console.log('admin already exists');
    return;
})()