process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();


chai.use(chaiHttp);
let server = chai.request('http://localhost:3000');

describe('#User login APIs', () => {

  describe('POST /v1/auth/login', () => {
        it('Should not login with empty email', (done) => {
            let user = {
                email: "",
                password:"password"
            }
          server
              .post('/v1/auth/login')
              .send(user)
              .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('message').eq('Email is required');
                done();
              });
        });
     });

   describe('POST /v1/auth/login', () => {
        it('Should not login with invalid email', (done) => {
            let user = {
                email: "ajayporiya",
                password:"password"
            }
          server
              .post('/v1/auth/login')
              .send(user)
              .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('message').eq('Email is not valid');
                done();
              });
        });
     });

   describe('POST /v1/auth/login', () => {
      it('Should not login with empty password', (done) => {
          let user = {
              email: "ajayporiya@gmail.com",
              password:"1"
          }
        server
            .post('/v1/auth/login')
            .send(user)
            .end((err, res) => {
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  res.body.should.have.property('status');
                  res.body.should.have.property('message').eq('Password is required');
              done();
            });
      });
      });

   describe('POST /v1/auth/login', () => {
      it('Should login when email and password match', (done) => {
          let user = {
              email: "ajayporiya@gmail.com",
              password:"password"
          }
        server
            .post('/v1/auth/login')
            .send(user)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('status');
                  res.body.should.have.property('message').eq('Login successfully');
              done();
            });
      });
   });
});