var AWS = require('aws-sdk');

// based on tutorial
// will point to local dynamodb
AWS.config.update({
  region: 'us-west-2',
  endpoint: "http://localhost:8001"
});

// initialize dynamo db
let dynamodb = new AWS.DynamoDB();
let docClient = new AWS.DynamoDB.DocumentClient();

// public
exports.getDynamoDB = async () => dynamodb;
exports.getDocClient = async () => docClient;
