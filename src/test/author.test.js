process.env.NODE_ENV = 'test';

const chai = require('chai');
const { assert } = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const Author = require('../models/Author');
const User = require('../models/User');
const server = require('../index');
const _p = require('../helpers/simpleasync');
const authorData = require('./author.data.test');
const userData = require('./user.data.test');
const jwtCreation = require('./jwtCreation');

chai.use(chaiHttp);
let authorId = null;
let token = null;

describe('Author Test Suite', () => {
    before(async () => { await Author.deleteMany({}) });

    describe('Testing POST /api/authors end point to pass', () => {
        it('should create a author', async () => {
            const [jwtErr, newJwt] = await _p(jwtCreation.jwt(userData.user));
            if (jwtErr) {
                console.log(`JWT not created ${jwtErr}`);
            }

            token = newJwt;

            const [err, res] = await _p(chai.request(server)
                .post('/api/authors')
                .set({ token })
                .send(authorData.create));

            authorId = res.body.data._id;

            assert.equal(res.status, 200, 'Http response code is 200');
            assert.isNull(err, 'Promise error is null');
            assert.isFalse(res.body.error, 'Error is false');
            assert.isObject(res.body.data, 'Data is object');
            assert.exists(res.body.data._id, 'MongoDB objectId exist');
        });
    });

    describe('Testing Get /api/authors end point to pass', () => {
        it('should return all authors', async () => {            
            const [err, res] = await _p(chai.request(server)
            .get(`/api/authors`)
            .set({ token }));

            assert.equal(res.status, 200, 'Http response code is 200');
            assert.isNull(err, 'Promise error is null');
            assert.isFalse(res.body.error, 'Error is false');
    		assert.isArray(res.body.data, 'Data should be an array');
    		assert.isNull(res.body.message, 'Message should be null');
        });
    });

    describe('Testing Get /api/authors/:id end point to pass', () => {
        it('should return a author', async () => {    
            const [err, res] = await _p(chai.request(server)
            .get(`/api/authors/${authorId}`)
            .set({ token }));

            assert.equal(res.status, 200, 'Http response code is 200');
            assert.isNull(err, 'Promise error is null');
            assert.isFalse(res.body.error, 'Error is false');
    		assert.exists(res.body.data._id, 'MongoDB objectId exist');
    		assert.isObject(res.body.data, 'Data is object');
    		assert.exists(res.body.data.createdAt, 'createdAt exist');
    		assert.exists(res.body.data.updatedAt, 'updatedAt exist');
        });
    });

    describe('Testing PUT /authors/:id end point to pass', () => {
    	it('should update a author', async () => {
    		const [err, res] = await _p(chai.request(server)
    			.put(`/api/authors/${authorId}`)
    			.set({ token })
    			.send(authorData.update));
    		assert.equal(res.status, 200, 'Http response code is 200');
    		assert.isNull(err, 'Promise error is null');
    		assert.isFalse(res.body.error, 'Error is false');
    		assert.exists(res.body.data._id, 'MongoDB objectId exist');
    		assert.isObject(res.body.data, 'Data is object');
    		assert.exists(res.body.data.createdAt, 'createdAt exist');
    		assert.exists(res.body.data.updatedAt, 'updatedAt exist');
    		assert.equal(res.body.data.name, 'Belayet Hossain', 'Author name updated');
    	});
    });

    describe('Testing DELETE /authors/:id end point to pass', () => {
    	it('should delete a authors', async () => {
    		const [err, res] = await _p(chai.request(server)
    			.delete(`/api/authors/${authorId}`)
                .set({ token }));
                                
    		assert.equal(res.status, 200, 'Http response code is 200');
    		assert.isNull(err, 'Promise error is null');
    		assert.isFalse(res.body.error, 'Error is false');
    		assert.equal(res.body.message, 'author deleted successfully', 'authors deleted successfully');
    	});
    });

    after(async () => { await Author.deleteMany({}) });
});