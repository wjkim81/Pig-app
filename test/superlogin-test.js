
http = require('http');

var user = JSON.stringify({
  "name": "Kim Wonjin",
  "username": "wonjkim",
  "email": "onejean81@gmail.com",
  "password": "12345678",
  "confirmPassword": "12345678"
});

url = 'http://localhost:3000/auth/register'

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(user)
  }
};

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
req.write(user);
req.end();