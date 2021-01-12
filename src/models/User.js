const mongoose 		= require('mongoose');
const { Schema } 	= mongoose;
mongoose.Promise 	= global.Promise;

const userSchema = new Schema({
	name: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		required: true
	},
	password: {
		type: String,
		trim: true,
		required: true
	},
	type: { // librarian, member
		type: String,
		lowercase: true,
		default: 'member'
	},
	photo: {
		type: String,
	},
	status: {
		type: String,
		lowercase: true,
		trim: true,
		default: 'active'
	}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


