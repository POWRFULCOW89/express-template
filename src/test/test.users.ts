import chai from 'chai';
import chaiHttp from 'chai-http';
const expect = chai.expect;
import { model } from 'mongoose';
import app from '../index';

const api = app; // Local testing
// const api = 'https://yourdeploy.herokuapp.com'; // Server testing

const User = model("User");

chai.use(chaiHttp); // Enablind API testing

describe('User flow', () => {
    beforeEach(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    const n = Date.now(); // Generating a sample user
    const newUser = {
        "username": `test-${n}`,
        "name": `NameSurname-${n}`,
        "email": `mail${n}@test.com`,
        "password": `password`
    }

    let token: string; // We'll create a new user, login, and get its token for testing
    let id: string;

    it('should create a new user', async () => {
        chai.request(api)
            .post('/v1/users')
            .set('content-type', 'application/json')
            .send(JSON.stringify(newUser))
            .end(async (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('username');
                expect(res.body).to.have.property('email');
                expect(res.body).to.have.property('token');

                let sampleUser = await User.findOne({ email: newUser.email })
                id = `${sampleUser._id}`;
            });
    });

    it('should login', async () => {
        chai.request(api)
            .post('/v1/users/login')
            .set('content-type', 'application/json')
            .send(JSON.stringify({
                email: newUser.email,
                password: newUser.password
            }))
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('user');
                expect(res.body.user).to.have.property('username');
                expect(res.body.user).to.have.property('email');
                expect(res.body.user).to.have.property('token');
                token = res.body.user.token;
            });
    });

    it('should retrieve all users', async () => {
        chai.request(api)
            .get('/v1/users')
            .set('content-type', 'application/json')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.be.greaterThanOrEqual(1);
            });
    });

    it('should retrieve three users', async () => {
        chai.request(api)
            .get('/v1/users?limit=3')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.equal(3);
            });
    });

    it('should retrieve specific users', async () => {
        chai.request(api)
            .get('/v1/users/' + id)
            .set('content-type', 'application/json')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('_id');
                expect(res.body).to.have.property('username');
                expect(res.body).to.have.property('name');
                expect(res.body).to.have.property('email');
            });
    });

    it('should edit the user profile', async () => {
        chai.request(api)
            .put('/v1/users/' + id)
            .set('content-type', 'application/json')
            .auth(token, { type: 'bearer' })
            .send(JSON.stringify({
                username: newUser.username + " edited",
                name: newUser.name + " edited",
                email: newUser.email + " edited",
            }))
            .end((err, res) => {
                console.log(res.body);
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('_id');
                expect(res.body).to.have.property('username');
                expect(res.body).to.have.property('name');
                expect(res.body).to.have.property('email');
            });
    });

    it('should delete the current user', async () => {
        chai.request(api)
            .delete('/v1/users/' + id)
            .set('content-type', 'application/json')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('_id');
                expect(res.body).to.have.property('username');
                expect(res.body).to.have.property('name');
                expect(res.body).to.have.property('email');
            });
    });
})
