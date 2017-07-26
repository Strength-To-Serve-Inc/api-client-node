'use strict';

const Lab = require('lab');
const Code = require('code');
const Client = require('../client.js');
let apiClient;

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const expect = Code.expect;

describe('User', () => {

    before((done) => {

        const token = process.env.TOKEN;
        const secret = process.env.SECRET;
        const host = 'http://' + process.env.HOST;
        const port = process.env.PORT;

        apiClient = new Client({
            token: token,
            secret: secret,
            host: host,
            port: port
        });
        done();
    });

    it('should GET a user by id', (done) => {

        apiClient.users.get(1).then((result) => {

            expect(result.response.statusCode).to.deep.equal(200);
            expect(result.data.id).to.equal('1');
            expect(result.error).to.be.null();
            done();
        });
    });

    it('should handle a non-existent user', (done) => {

        apiClient.users.get(10000).catch((result) => {

            const collection = result.data.collection;

            expect(result.response.statusCode).to.deep.equal(404);
            expect(collection.error.title).to.equal('Not found');
            expect(collection.error.code).to.equal(404);
            expect(result.error).to.be.null();
            done();
        });
    });

    it('should GET a list of all users', (done) => {

        apiClient.users.list().then((result) => {

            expect(result.response.statusCode).to.deep.equal(200);
            expect(result.data[0].id).to.equal('1');
            expect(result.data.length).to.above(1);
            expect(result.error).to.be.null();
            done();
        });
    });

    it('should create a user', (done) => {

        const userData = {
            template: {
                data: [
                    { name: 'email', value: Date.now() + '@example.com' },
                    { name: 'givenName', value: 'Jon' },
                    { name: 'familyName', value: 'Doe' },
                    { name: 'telephone', value: '5127088860' },
                    { name: 'franchiseCity', value: 'Austin' },
                    { name: 'streetAddress', value: '105 Main Street' },
                    { name: 'addressLocality', value: 'Austin' },
                    { name: 'addressRegion', value: 'Texas' },
                    { name: 'postalCode', value: '78704' },
                    { name: 'website', value: 'https://churchexample.com' },
                    { name: 'planLevel', value: 'Standard' },
                    { name: 'church', value: 'Community Church' },
                    { name: 'churchSize', value: 4321 }
                ]
            }
        };

        apiClient.users.create(userData).then((result) => {

            expect(result.response.statusCode).to.deep.equal(201);
            expect(result.data.collection.items.length).to.equal(1);
            done();
        });
    });
});