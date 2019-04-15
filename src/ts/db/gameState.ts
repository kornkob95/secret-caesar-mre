import { DbObject } from './index';

export enum State {
	Setup = 0,
	Tutorial,
	Night,
	Nominate,
	Election,
	LameDuck,
	Policy1,
	Policy2,
	Veto,
	Aftermath,
	Investigate,
	Peek,
	NameSuccessor,
	Execute,
	Done
}

export class GameState extends DbObject {
	public get state() {
		return (this.patch.state || this.cache.state) as State;
	}
	public set state(val) {
		this.patch.state = val;
	}

	public get turnOrder() {
		return (this.patch.turnOrder || this.cache.turnOrder) as string[];
	};
	public set turnOrder(val) {
		this.patch.turnOrder = val;
	}

	public votesInProgress: string[];

	constructor(id: string) {
		super('game', id);
		this.patch = {
			...this.patch,
			/*
			State one of: setup, tutorial, night, nominate, election, lameDuck, policy1, policy2,
			veto, aftermath, investigate, peek, nameSuccessor, execute, done
			*/
			state: 'setup',
			turnOrder: [], // CSV of userIds
			votesInProgress: [], // CSV of voteIds
			president: '', // userId
			chancellor: '', // userId
			lastPresident: '', // userId
			lastChancellor: '', // userId
			lastElection: '', // voteId

			liberalPolicies: 0,
			fascistPolicies: 0,
			// bit-packed boolean array. liberal=1, fascist=0
			// most sig bit is 1. least sig bit is top of deck
			deck: 0x1, // bpba
			discard: 0x1, // bpba
			hand: 0x1, // bpba
			specialElection: false,
			failedVotes: 0,
			victory: '',
			tutorial: ''
		};

		Object.assign(this.propTypes, {
			id: 'string',
			state: 'string',
			turnOrder: 'csv',
			votesInProgress: 'csv',
			president: 'string',
			chancellor: 'string',
			lastPresident: 'string',
			lastChancellor: 'string',
			lastElection: 'string',
			liberalPolicies: 'int',
			fascistPolicies: 'int',
			deck: 'int',
			discard: 'int',
			hand: 'int',
			specialElection: 'bool',
			failedVotes: 'int',
			victory: 'string',
			tutorial: 'string'
		});

		this.properties.push(...Object.keys(defaults));
		Object.assign(this.delta, defaults);
		this.players = {};
		this.votes = {};
	}

	loadPlayers() {
		this.get('turnOrder').forEach((e => {
			this.players[e] = new Player(e);
		}).bind(this));

		return Promise.all(
			this.get('turnOrder').map(
				(e => this.players[e].load()).bind(this)
			)
		);
	}

	serializePlayers(hideSecrets = false) {
		let c = {};
		for (let i in this.players) {
			c[i] = this.players[i].serialize(hideSecrets);
		}
		return c;
	}

	loadVotes() {
		this.get('votesInProgress').forEach((e => {
			this.votes[e] = new Vote(e);
		}).bind(this));

		let lastElection = this.get('lastElection');
		if (lastElection)
			this.votes[lastElection] = new Vote(lastElection);

		return Promise.all(
			Object.keys(this.votes).map(e => this.votes[e].load())
		);
	}

	serializeVotes() {
		let c = {};
		for (let i in this.votes) {
			c[i] = this.votes[i].serialize();
		}
		return c;
	}
}