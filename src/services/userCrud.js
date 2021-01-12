const User = require('../models/User');
const _p = require('../helpers/simpleasync');

//create user
module.exports.createUser = async userInfo => {
    return new Promise(async (resolve, reject) => {
        const [error, saveUserInfo] = await _p(User.create(userInfo));

        if (!error) {
            return resolve(saveUserInfo);
        } else {
            return reject(error.message);
        }
    });
};

//get all users || can use query string
module.exports.getUsers = async query => {
    return new Promise(async (resolve, reject) => {
        const pageNum = query.page ? parseInt(query.page, 10) : 1;
        const Limit = query.limit ? parseInt(query.limit, 10) : 10;
        const skip = Limit * (pageNum - 1);

        if (query.page) delete query.page;
        if (query.limit) delete query.limit;

        const [error, users] = await _p(User.find(query)
            .select({password: 0})
            .limit(Limit)
            .skip(skip)
            .sort({ createdAt: 'desc' }));

        if (!error) {
            return resolve(users);
        } else {
            return reject(error.message);
        }
    });
};

//get user by user id
module.exports.getUserById = async id => {
    return new Promise(async (resolve, reject) => {
        const [error, user] = await _p(User.findOne({ _id: id }).select({password: 0}));

        if (!error) {
            return resolve(user);
        } else {
            return reject(error.message);
        }
    });
};

//update user by user id
module.exports.updateUserById = async (id, userInfo) => {
    return new Promise(async (resolve, reject) => {
        const [error, updateUserInfo] = await _p(User.findOneAndUpdate({ _id: id }, userInfo, { new: true }));

        if (!error) {
            return resolve(updateUserInfo);
        } else {
            return reject(error.message);
        }
    });
};

//login user
module.exports.loginUser = async loginInfo => {
    return new Promise(async (resolve, reject) => {
        const [error, user] = await _p(User.findOne({ email: loginInfo.email, status: { $ne: 'inactive' } }));

        if (!user) return resolve(null);
        if (user) return resolve(user);
        if (error) return reject(error.message);
    });
};