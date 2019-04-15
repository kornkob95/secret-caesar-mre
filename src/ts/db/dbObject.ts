import parseCSV from '../util/parseCSV';
import { createClient } from './redisClient';
const client = createClient();

export type PropType = string | number | boolean | string[];

export class DbObject {
	protected cache: { [prop: string]: PropType } = {};
	protected patch: { [prop: string]: PropType } = {};

	public get id() { return (this.patch.id || this.cache.id) as string; }

	constructor(protected type: string, id: string) {
		this.patch.id = id;
	}

	public async load() {
		const currentProps = { ...this.patch, ...this.cache };
		const propNames = Object.keys(currentProps);
		const result = await client.hmgetAsync(`${this.type}:${this.id}`, ...propNames);

		for (let i = 0; i < propNames.length; i++) {
			const name = propNames[i];
			const val = result[i];

			if (!val) continue;

			let type = typeof currentProps[name] as string;
			if (Array.isArray(currentProps[name])) {
				type = 'csv';
			}

			switch (type) {
				case 'csv':
					this.cache[name] = parseCSV(result[i]);
					break;
				case 'number':
				case 'boolean':
					this.cache[name] = JSON.parse(result[i]);
					break;
				case 'string':
				default:
					this.cache[name] = result[i];
					break;
			}
		}

		if (Object.keys(this.cache).length > 0)
			this.patch = {};
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
