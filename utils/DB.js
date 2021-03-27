const MongoClient = require('mongodb').MongoClient;

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.client = client;