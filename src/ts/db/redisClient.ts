import redis from 'redis';

import { promisify } from 'typed-promisify';

export class RedisPromiseClient extends redis.RedisClient {
	constructor(options: redis.ClientOpts) {
		super(options);
	}
	public hmgetAsync = promisify(super.hmget).bind(this) as (...args: string[]) => Promise<string[]>;
}

export function createClient(options: redis.ClientOpts = { host: 'localhost', port: 6379 }) {
	return new RedisPromiseClient(options);
}
