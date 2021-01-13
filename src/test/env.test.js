  
process.env.NODE_ENV	=	'test';
const chai				=	require('chai');
const { assert }		=	require('chai');
const chaiHttp			=	require('chai-http');
require('dotenv').config();

chai.use(chaiHttp);

describe('ENV Test Suite', () => {
	describe('Testing .evn file to pass', () => {
		it('Should check MONGODB URI exist in env', () => {
			assert.exists(process.env.MONGODB_URI, 'MONGODB URI exists.');
		});
	});
});