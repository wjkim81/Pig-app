


var userSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "http://mynet.com/schemas/user.json#",
  "title": "User",
  "description": "User profile with connections",
  "type": "object",
  "properties": {
    "id": {
      "description": "positive integer or string of digits",
      "type": ["string", "integer"],
      "pattern": "^[1-9][0-9]*$",
      "minimum": 1
    },
    "name": { "type": "string", "maxLength": 128 },
    "email": { "type": "string", "format": "email" },
    "phone": { "type": "string", "pattern": "^[0-9()\\-\\.\\s]+$" }, 
    "address": {
      "type": "object",
      "additionalProperties": { "type": "string" },
      "maxProperties": 6,
      "required": ["street", "postcode", "city", "country"]
    },
    "personal": {
      "type": "object",
      "properties": {
        "DOB": { "type": "string", "format": "date" },
        "age": { "type": "integer", "minimum": 13 },
        "gender": { "enum": ["female", "male"] }
      },
      "required": ["DOB", "age"],
      "additionalProperties": false
    },
    "connections": {
      "type": "array",
      "maxItems": 150,
      "items": {
        "title": "Connection",
        "description": "User connection schema",
        "type": "object",
        "properties": {
          "id": {
            "type": ["string", "integer"],
            "pattern": "^[1-9][0-9]*$",
            "minimum": 1
          },
          "name": { "type": "string", "maxLength": 128 },
          "since": { "type": "string", "format": "date" },
          "connType": { "type": "string" },
          "relation": {},
          "close": {}
        },
        "oneOf": [
          {
            "properties": {
              "connType": { "enum": ["relative"] },
              "relation": { "type": "string" }
            },
            "dependencies": {
              "relation": ["close"]
            }
          },
          {
            "properties": {
              "connType": { "enum": ["friend", "colleague", "other"] },
              "relation": { "not": {} },
              "close": { "not": {} }
            }
          }
        ],
        "required": ["id", "name", "since", "connType"],
        "additionalProperties": false
      }
    },
    "feeds": {
      "title": "feeds",
      "description": "Feeds user subscribes to",
      "type": "object",
      "patternProperties": {
        "^[A-Za-z]+$": { "type": "boolean" }
      },
      "additionalProperties": false
    },
    "createdAt": { "type": "string", "format": "date-time" }
  }
};

var data = {
  "id": 64209690,
  "name": "Jane Smith",
  "email": "jane.smith@gmail.com",
  "phone": "07777 888 999",
  "address": {
    "street": "Flat 1, 188 High Street Kensington",
    "postcode": "W8 5AA",
    "city": "London",
    "country": "United Kingdom"
  },
  "personal": {
    "DOB": "1982-08-16",
    "age": 33,
    "gender": "female"
  },
  "connections": [
    {
      "id": "35434004285760",
      "name": "John Doe",
      "connType": "friend",
      "since": "2014-03-25"
    },
    {
      "id": 13418315,
      "name": "James Smith",
      "connType": "relative",
      "relation": "husband",
      "since": "2012-07-03"
    }
  ],
  "feeds": {
    "news": true,
    "sport": true,
    "fashion": false
  },
  "createdAt": "2015-09-22T10:30:06.000Z"
}

/*
var ajv = Ajv({allErrors: true});
var valid = ajv.validate(userSchema, data);
if (valid) {
  console.log('User data is valid');
} else {
  console.log('User data is INVALID!');
  console.log(ajv.errors);
}
*/

var Ajv = require('ajv');
var ajv = Ajv({allErrors: true});
var validate = ajv.compile(userSchema);
var valid = validate(data);
if (!valid) console.log(validate.errors);