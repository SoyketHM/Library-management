const { check }    = require('express-validator');

module.exports.bookValidator = [
	check('name')
		.optional().exists({ checkNull: true, checkFalsy: true }).withMessage('Name can\'t be empty').bail().isString().withMessage('Name must be a string'),
    check('author')
		.optional().exists({ checkNull: true, checkFalsy: true }).bail().isString().withMessage('Author must be a string'),
    check('genre')
		.optional().exists({ checkNull: true, checkFalsy: true }).bail().isString().withMessage('Genre must be a string'),
	check('status')
		.optional().exists({ checkNull: true, checkFalsy: true }).bail().isString().withMessage('Status must be a string'),
];