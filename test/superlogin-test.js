const http        = require('http');
const querystring = require('querystring')

const SLC         = require('../middlewares/superlogin/superlogin-client')

var user = {
  "name": "Kim Wonjin",
  "username": "test2",
  "email": "test2@example.com",
  "password": "12345678",
  "confirmPassword": "12345678"
};

var userq = querystring.stringify(user);



/*
var url = 'http://localhost:3000/auth/register'
var params = 'name=' + user.name + '&username=' + user.username + '&email=' + user.email + '&password=' + user.password + 'confirmPassword=' + 'confirmPassword';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(userq)
  }
};



const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});
req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// write data to request body

req.write(userq);
req.end();



http.get('http://localhost:3000/session', (res) => {
  console.log(res);
});
*/


let credentials = {
  username: 'test1',
  password: '12345678'
};

const joptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
    //'Content-Length': Buffer.byteLength(credentials)
  }
};

const req = http.request(joptions, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});
req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// write data to request body

req.write(JSON.stringify(credentials));
req.end();






/*
http.request(options, (res) => {

  let data = ''
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data)
  })
  //console.log(res);
}).on('error', (err) => {
  console.log(err);
});
*/

//console.log(user);
//console.log(querystring.stringify(user));