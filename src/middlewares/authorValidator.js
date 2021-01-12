const { check }    = require('express-validator');

module.exports.authorValidator = [
	check('name')
		.optional().exists({ checkNull: true, checkFalsy: true }).withMessage('Name can\'t be empty').bail().isString().withMessage('Name must be a string'),
];