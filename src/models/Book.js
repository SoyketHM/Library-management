const mongoose 		= require('mongoose');
const { Schema } 	= mongoose;
const objectID      = Schema.ObjectId;
mongoose.Promise 	= global.Promise;

const bookSchema = new Schema({
	name: {
		type: String,
		trim: true
	},
	author: {
		type: objectID,
		ref: 'Author',
		required: true
	},
	genre: {
		type: String,
		trim: true,
	},
	status: { // available, borrowed
		type: String,
		lowercase: true,
		default: 'available'
	}
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);


