import { DbObject } from '.';

export enum PlayerRole {
	Unassigned = 0,
	Hitler,
	Fascist,
	Liberal
}

export enum PlayerState {
	Normal = 0,
	Investigated,
	Dead
}

export class Player extends DbObject {
	public get displayName() {
		return this.get('displayName') as string;
	}
	public set displayName(val) {
		this.set('displayName', val);
	}

	public get isModerator() {
		return this.get('isModerator') as boolean;
	}
	public set isModerator(val) {
		this.set('isModerator', val);
	}

	public get seatNum() {
		return this.get('seatNum') as number;
	}
	public set seatNum(val) {
		this.set('seatNum', val);
	}

	public get role() {
		return this.get('role') as PlayerRole;
	}
	public set role(val) {
		this.set('role', val as number);
	}

	public get state() {
		return this.get('state') as PlayerState;
	}
	public set state(val) {
		this.set('state', val as number);
	}

	public constructor(id: string) {
		super('player', id);
		this.patch = {
			...this.patch,
			displayName: '',
			isModerator: false,
			seatNum: null,
			role: PlayerRole.Unassigned,
			state: PlayerState.Normal
		};
	}
}
