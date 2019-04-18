import { DbObject, Player, Vote } from '.';

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

export enum Policy {
	Fascist = 0,
	Liberal
}

export class GameState extends DbObject {
	public get state() {
		return this.get('state') as State;
	}
	public set state(val) {
		this.set('state', val as number);
	}

	public get turnOrder() {
		return this.get('turnOrder') as string[];
	};
	public set turnOrder(val) {
		this.set('turnOrder', val);
	}

	public get votesInProgress() {
		return this.get('votesInProgress') as string[];
	}
	public set votesInProgress(val) {
		this.set('votesInProgress', val);
	}

	public get president() {
		return this.get('president') as string;
	}
	public set president(val) {
		this.set('president', val);
	}

	public get chancellor() {
		return this.get('chancellor') as string;
	}
	public set chancellor(val) {
		this.set('chancellor', val);
	}

	public get lastPresident() {
		return this.get('lastPresident') as string;
	}
	public set lastPresident(val) {
		this.set('lastPresident', val);
	}

	public get lastChancellor() {
		return this.get('lastChancellor') as string;
	}
	public set lastChancellor(val) {
		this.set('lastChancellor', val);
	}

	public get lastElection() {
		return this.get('lastElection') as string;
	}
	public set lastElection(val) {
		this.set('lastElection', val);
	}

	public get liberalPolicies() {
		return this.get('liberalPolicies') as number;
	}
	public set liberalPolicies(val) {
		this.set('liberalPolicies', val);
	}

	public get fascistPolicies() {
		return this.get('fascistPolicies') as number;
	}
	public set fascistPolicies(val) {
		this.set('fascistPolicies', val);
	}

	public get deck() {
		return this.get('deck') as Policy[];
	}
	public set deck(val) {
		this.set('deck', val as number[]);
	}

	public get discardPile() {
		return this.get('discard') as Policy[];
	}
	public set discardPile(val) {
		this.set('discard', val as number[]);
	}

	public get hand() {
		return this.get('hand') as Policy[];
	}
	public set hand(val) {
		this.set('hand', val as number[]);
	}

	public get specialElection() {
		return this.get('specialElection') as boolean;
	}
	public set specialElection(val) {
		this.set('specialElection', val);
	}

	public get failedVotes() {
		return this.get('failedVotes') as number;
	}
	public set failedVotes(val) {
		this.set('failedVotes', val);
	}

	public get victory() {
		return this.get('victory') as string;
	}
	public set victory(val) {
		this.set('victory', val);
	}

	public get tutorial() {
		return this.get('tutorial') as string;
	}
	public set tutorial(val) {
		this.set('tutorial', val);
	}

	public players: { [id: string]: Player } = {};
	public votes: { [id: string]: Vote } = {};

	public constructor(id: string) {
		super('game', id);
		this.patch = {
			...this.patch,

			state: State.Setup as number,
			turnOrder: [], // CSV of userIds
			votesInProgress: [], // CSV of voteIds
			president: '', // userId
			chancellor: '', // userId
			lastPresident: '', // userId
			lastChancellor: '', // userId
			lastElection: '', // voteId

			liberalPolicies: 0,
			fascistPolicies: 0,
			deck: [],
			discard: [],
			hand: [],
			specialElection: false,
			failedVotes: 0,
			victory: '',
			tutorial: ''
		};
	}

	public loadPlayers() {
		const promises: Promise<void>[] = [];
		for (const playerId of this.turnOrder) {
			this.players[playerId] = new Player(playerId);
			promises.push(this.players[playerId].load());
		}

		return Promise.all(promises);
	}

	public serializePlayers() {
		const c: { [id: string]: any } = {};
		for (let id in this.players) {
			c[id] = this.players[id].serialize();
		}
		return c;
	}

	public loadVotes() {
		const promises: Promise<void>[] = [];
		for (const voteId of this.votesInProgress) {
			const v = this.votes[voteId] = new Vote(voteId);
			promises.push(v.load());
		}

		if (this.lastElection) {
			const e = this.votes[this.lastElection] = new Vote(this.lastElection);
			promises.push(e.load());
		}

		return Promise.all(promises);
	}

	public serializeVotes() {
		let c: { [id: string]: any } = {};
		for (let id in this.votes) {
			c[id] = this.votes[id].serialize();
		}
		return c;
	}
}