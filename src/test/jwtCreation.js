const jwt = require('../helpers/jwt');
const _p = require('../helpers/simpleasync');

module.exports.jwt = async (userInfo) => {
    return new Promise(async (resolve, reject) => {
        const jwtInfo = {
            id: userInfo.id,
            name: userInfo.name,
            type: userInfo.type,
            status: userInfo.status,
			ttl: 1800000
        };

        const [jwtErr, jwtToken] = await _p(jwt.encode(jwtInfo));
        if (!jwtErr) {
            return resolve(jwtToken);
        } else {
            return reject(jwtErr);
        }
    });
};