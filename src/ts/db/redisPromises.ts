import redis from 'redis';

export function hmgetAsync(client: redis.RedisClient, ...args: string[]): Promise<string[]> {
	return new Promise((resolve, reject) => {
		client.hmget(...args, (err, reply) => {
			if (err) {
				reject(err);
			} else {
				resolve(reply);
			}
		});
	});
}

export function execAsync(multi: redis.Multi): Promise<any[]> {
	return new Promise((resolve, reject) => {
		multi.exec((err, reply) => {
			if (err) {
				reject(err);
			} else {
				resolve(reply);
			}
		})
	})
}

export function delAsync(client: redis.RedisClient, ...args: string[]) {
	return new Promise((resolve, reject) => {
		client.del(...args, (err, reply) => {
			if (err) {
				reject(err);
			} else {
				resolve(reply);
			}
		});
	});
}
