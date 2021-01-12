const mongoose 		= require('mongoose');
const { Schema } 	= mongoose;
mongoose.Promise 	= global.Promise;

const authorSchema = new Schema({
	name: {
		type: String,
		trim: true,
		required: true
	}
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema);


