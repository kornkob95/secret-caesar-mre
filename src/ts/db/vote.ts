import { DbObject } from '.';

export enum VoteType {
	Elect = 0,
	Join,
	Kick,
	Reset,
	ConfirmRole,
	Tutorial
}

export class Vote extends DbObject {
	public get type() {
		return this.get('type') as VoteType;
	}
	public set type(val) {
		this.set('type', val as number);
	}

	public get target() {
		return this.get('target') as string;
	}
	public set target(val) {
		this.set('target', val);
	}

	public get targetName() {
		return this.get('targetName') as string;
	}
	public set targetName(val) {
		this.set('targetName', val);
	}

	public get toPass() {
		return this.get('toPass') as number;
	}
	public set toPass(val) {
		this.set('toPass', val);
	}

	public get requires() {
		return this.get('requires') as number;
	}
	public set requires(val) {
		this.set('requires', val);
	}

	public get yesVoters() {
		return this.get('yesVoters') as string[];
	}
	public set yesVoters(val) {
		this.set('yesVoters', val);
	}

	public get noVoters() {
		return this.get('noVoters') as string[];
	}
	public set noVoters(val) {
		this.set('noVoters', val);
	}

	public get nonVoters() {
		return this.get('nonVoters') as string[];
	}
	public set nonVoters(val) {
		this.set('nonVoters', val);
	}

	public constructor(id: string) {
		super('vote', id);

		this.patch = {
			...this.patch,
			type: VoteType.Elect,
			target: '', // userId of president/joiner/kickee
			targetName: '', // display name of join requester

			toPass: 1, // number of yea votes needed to pass
			requires: 1, // number of total votes before evaluation
			yesVoters: [], // CSV of userIds that voted yes
			noVoters: [], // CSV of userIds that voted no
			nonVoters: [] // CSV of userIds that are not allowed to vote
		};
	}
}
