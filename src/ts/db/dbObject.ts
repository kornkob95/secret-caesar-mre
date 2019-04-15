import { createClient } from './redisClient';
const client = createClient();

export type PropType = string | number | boolean | string[];

export class DbObject {
	protected cache: { [prop: string]: PropType } = {};
	protected patch: { [prop: string]: PropType } = {};
	constructor(protected type: string, id: string) {
		this.patch.id = id;
	}

	public async load() {
		let self = this;
		return new Promise((resolve, reject) => {
			client.hmgetAsync(self.type + ':' + self.get('id'), self.properties)
				.then(result => {
					self.properties.forEach((k, i) => {
						if (result[i] !== null) {
							switch (self.propTypes[k]) {

								case 'csv':
									self.cache[k] = parseCSV(result[i]);
									break;
								case 'int':
								case 'bool':
								case 'json':
									self.cache[k] = JSON.parse(result[i]);
									break;
								case 'string':
								default:
									self.cache[k] = result[i];
									break;
							}
						}
					});
					if (Object.keys(self.cache).length > 0)
						self.delta = {};
					resolve(this);
				})
				.catch(err => {
					console.error(err);
					reject(err);
				});
		});
	}

	save() {
		let self = this;
		return new Promise((resolve, reject) => {
			if (Object.keys(self.delta).length === 0)
				resolve({});

			let dbSafe = {};
			for (let i in self.delta) {
				switch (self.propTypes[i]) {
					case 'csv':
						dbSafe[i] = self.delta[i].join(',');
						break;
					case 'int':
					case 'bool':
					case 'json':
						dbSafe[i] = JSON.stringify(self.delta[i]);
						break;
					case 'string':
					default:
						dbSafe[i] = self.delta[i];
				}
			}

			client.multi()
				.hmset(self.type + ':' + self.get('id'), dbSafe)
				.expire(self.type + ':' + self.get('id'), 60 * 60 * 24)
				.execAsync()
				.then(result => {
					Object.assign(self.cache, self.delta);
					resolve(self.delta);
					self.delta = {};
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	discard() {
		self.delta = {};
	}

	get(field) {
		if (this.delta[field] !== undefined)
			return this.delta[field];
		else if (this.cache[field] !== undefined)
			return this.cache[field];
	}

	set(field, val) {
		if (this.cache[field] !== undefined || this.delta[field] !== undefined)
			this.delta[field] = val;
		else {
			throw new Error(`Field ${field} is not valid on this object`);
		}
	}

	serialize() {
		let safe = {};
		Object.assign(safe, this.cache, this.delta);
		return safe;
	}

	destroy() {
		let self = this;
		return new Promise((resolve, reject) => {
			client.delAsync(self.type + ':' + self.get('id'))
				.then(result => {
					self.delta = Object.assign({}, self.cache, self.delta);
					self.cache = {};
					resolve();
				})
				.catch(err => {
					console.error(err);
					reject(err);
				});
		});
	}
}
