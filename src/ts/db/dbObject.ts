import { EventEmitter } from 'events';
import { createClient } from 'redis';
import { delAsync, execAsync, hmgetAsync } from './redisPromises';

import parseCSV from '../util/parseCSV';
const client = createClient();

export type PropType = string | number | boolean | string[] | number[];
type PropCollection = { [id: string]: PropType };

function collectPatchOriginal(patch: PropCollection, original: PropCollection): PropCollection {
	const prepatch = {} as PropCollection;
	for (const key in patch) {
		prepatch[key] = original[key];
	}
	return prepatch;
}

export class DbObject extends EventEmitter {
	protected cache: PropCollection = {};
	protected patch: PropCollection = {};

	public get id() { return this.get('id') as string; }

	protected constructor(private dbType: string, id: string) {
		super();
		this.patch.id = id;
	}

	public async load() {
		const currentProps = { ...this.patch, ...this.cache };
		const propNames = Object.keys(currentProps);
		const result = await hmgetAsync(client, `${this.dbType}:${this.id}`, ...propNames);

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

	public async save() {
		if (Object.keys(this.patch).length === 0)
			return {};

		const dbSafe: { [key: string]: string } = {};
		const currentProps = { ...this.patch, ...this.cache };
		const propNames = Object.keys(currentProps);

		for (let i = 0; i < propNames.length; i++) {
			const name = propNames[i];

			let type = typeof currentProps[name] as string;
			if (Array.isArray(currentProps[name])) {
				type = 'csv';
			}

			switch (type) {
				case 'csv':
					dbSafe[name] = (this.patch[name] as any[]).join(',');
					break;
				case 'number':
				case 'boolean':
					dbSafe[name] = JSON.stringify(this.patch[name]);
					break;
				case 'string':
				default:
					dbSafe[name] = this.patch[name] as string;
					break;
			}
		}

		await execAsync(client.multi()
			.hmset(this.dbType + ':' + this.id, dbSafe)
			.expire(this.dbType + ':' + this.id, 60 * 60 * 24)
		);

		// collect old values
		const prePatchValues = collectPatchOriginal(this.patch, this.cache);

		Object.assign(this.cache, this.patch);
		const patch = this.patch;
		this.patch = {};

		this.emit('update', patch, prePatchValues);
		return patch;
	}

	public discard() {
		this.patch = {};
	}

	protected get(field: string) {
		if (this.patch[field] !== undefined)
			return this.patch[field];
		else if (this.cache[field] !== undefined)
			return this.cache[field];
	}

	protected set(field: string, val: PropType) {
		if (this.cache[field] !== undefined || this.patch[field] !== undefined)
			this.patch[field] = val;
		else {
			throw new Error(`Field ${field} is not valid on this object`);
		}
	}

	public serialize() {
		return { ...this.cache, ...this.patch };
	}

	public async destroy() {
		await delAsync(client, this.dbType + ':' + this.id);
		this.patch = { ...this.cache, ...this.patch };
		this.cache = {};
	}
}
