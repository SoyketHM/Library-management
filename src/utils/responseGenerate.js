module.exports.createResponse = (data, message = null, error = false) => {
	return {
		error,
		data,
		message
	};
};
