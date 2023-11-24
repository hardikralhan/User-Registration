const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  app,
  server
} = require('./index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('JWT Authentication', () => {

  it('should authenticate a user and return a JWT', (done) => {
    chai
      .request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should handle authentication with invalid credentials', (done) => {
    chai
      .request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });

  it('should handle authentication without credentials', (done) => {
    chai
      .request(app)
      .post('/api/auth/login')
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
});


describe('User Profile Retrieval', () => {
  let token;
  let userId = '6560c546dc266ad687cb26a2'

  before((done) => {
    // Authenticate a test user and get the JWT token
    chai
      .request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
      .end((err, res) => {
        token = res.body.result.token;
        done();
      });
  });

  it('should retrieve user profile with a valid JWT', (done) => {
    chai
      .request(app)
      .post(`/api/users/${userId}`)
      .set('Authorization', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        // Add more assertions based on your user profile structure
        done();
      });
  });

  it('should handle profile retrieval without a valid JWT', (done) => {
    chai
      .request(app)
      .post(`/api/users/${userId}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});

describe('User Registration', () => {
  it('should handle user registration', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send({
        email: 'test@iii.com',
        password: 'password123',
        name: "hardik"
      })
      .end((err, res) => {
        if (res.status === 200) {
          // Registration successful, assert the message
          expect(res.text).to.equal('Successfully Signed Up');
          done();
        } else {
          // // Registration failed, maybe user already exists
          // expect(res.status).to.equal(400);

          const errorResponse = JSON.parse(res.text);

          if (errorResponse.errorCode === 'USREG0004') {
            // User already exists
            expect(errorResponse.error).to.equal('This user already exists.');
          } else if (errorResponse.errorCode === 'USREG0005') {
            // Missing fields
            expect(errorResponse.error).to.equal('Fields Missing');
          } else {
            // Unexpected error response
            assert.fail('Unexpected error response');
          }

          done();
        }
      });
  });
});