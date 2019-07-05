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

	public get seatId() {
		return this.get('seatId') as number;
	}
	public set seatId(val) {
		this.set('seatId', val);
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

	public get connected() {
		return this.get('connected') as boolean;
	}
	public set connected(val) {
		this.set('connected', val as boolean);
	}

	public constructor(id: string) {
		super('player', id);
		this.patch = {
			...this.patch,
			displayName: '',
			isModerator: false,
			seatId: -1,
			role: PlayerRole.Unassigned,
			state: PlayerState.Normal,
			connected: true
		};
	}
}
