const redis = require('redis'),
	bluebird = require('bluebird'),
	parseCSV = require('./utils').parseCSV,
	config = require('./config');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let client = redis.createClient(config.redis);

let playerForSocket = exports.playerForSocket = {};
let socketForPlayer = exports.socketForPlayer = {};

export * from './dbObject';