const {validationResult} = require('express-validator/check');

module.exports.checkInvalid = function(req,res,next){
	let errors = validationResult(req);
	let errArray = errors.array();
	const validationErrors = errArray.reduce((obj, item) => {
		obj[item.param] = item.msg;
		return obj;
	}, {});

	if(errors.isEmpty()) {
		return next();
	} else{
		return res.status(400).json( validationErrors );
	}
};
