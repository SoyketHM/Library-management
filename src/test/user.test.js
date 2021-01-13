process.env.NODE_ENV = 'test';

const chai = require('chai');
const { assert } = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const User = require('../models/User');
const server = require('../index');
const _p = require('../helpers/simpleasync');
const userData = require('./user.data.test');

chai.use(chaiHttp);
let userId = null;
let token = null;

describe('User Test Suite', () => {
    before(async () => { await User.deleteMany({}) });

    describe('Testing POST /login end point to pass', () => {
        it('should login as admin', async () => {            
            const [err, res] = await _p(chai.request(server)
            .post(`/login`)
            .send(userData.login));
            
            token = res.body.data.token;

            assert.equal(res.status, 200, 'Http response code is 200');
            assert.isNull(err, 'Promise error is null');
            assert.isFalse(res.body.error, 'Error is false');
            assert.exists(res.body.data.token, 'Token is exist');
            assert.isString(res.body.data.token, 'Token is string');
        });
    });

    describe('Testing POST /api/signup end point to pass', () => {
        it('should create a user', async () => {
            const [err, res] = await _p(chai.request(server)
                .post('/api/signup')
                .set({ token })
                .send(userData.create));

            userId = res.body.data.id;

            assert.equal(res.status, 200, 'Http response code is 200');
            assert.isNull(err, 'Promise error is null');
            assert.isFalse(res.body.error, 'Error is false');
            assert.isObject(res.body.data, 'Data is object');
            assert.exists(res.body.data.id, 'MongoDB objectId exist');
            assert.exists(res.body.data.token, 'Token is exist');
            assert.isString(res.body.data.token, 'Token is string');
        });
    });
    
    describe('Testing Get /api/users end point to pass', () => {
        it('should return all users', async () => {            
            const [err, res] = await _p(chai.request(server)
            .get(`/api/users`)
            .set({ token }));

            assert.equal(res.status, 200, 'Http response code is 200');
            assert.isNull(err, 'Promise error is null');
            assert.isFalse(res.body.error, 'Error is false');
    		assert.isArray(res.body.data, 'Data should be an array');
    		assert.isNull(res.body.message, 'Message should be null');
        });
    });
    
    describe('Testing Get /api/users/:id end point to pass', () => {
        it('should return a user', async () => {    
            const [err, res] = await _p(chai.request(server)
            .get(`/api/users/${userId}`)
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

    describe('Testing PUT /users/:id end point to pass', () => {
    	it('should update a user', async () => {
    		const [err, res] = await _p(chai.request(server)
    			.put(`/api/users/${userId}`)
    			.set({ token })
    			.send(userData.update));
    		assert.equal(res.status, 200, 'Http response code is 200');
    		assert.isNull(err, 'Promise error is null');
    		assert.isFalse(res.body.error, 'Error is false');
    		assert.exists(res.body.data._id, 'MongoDB objectId exist');
    		assert.isObject(res.body.data, 'Data is object');
    		assert.exists(res.body.data.createdAt, 'createdAt exist');
    		assert.exists(res.body.data.updatedAt, 'updatedAt exist');
    		assert.equal(res.body.data.name, 'Belayet Hossain', 'User name updated');
    		assert.equal(res.body.data.status, 'inactive', 'User status updated');
    	});
    });
    
    after(async () => { await User.deleteMany({}) });
});