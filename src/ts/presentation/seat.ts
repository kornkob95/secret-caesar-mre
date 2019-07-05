import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Ballot, Nametag } from '.';
import { App } from '..';
import * as DB from '../db';

export class Seat {
	public index: number;
	public nametag: Nametag;
	public ballot: Ballot;

	private _ownerId: string;
	private _updateConnectionStatus = this.updateConnectionStatus.bind(this);
	public get ownerId() { return this._ownerId; }
	public set ownerId(val) {
		if (this.owner) {
			this.owner.off('update', this._updateConnectionStatus);
		}
		this._ownerId = val;
		if (this.owner) {
			this.owner.on('update', this._updateConnectionStatus);
		}
	}

	public get owner() {
		return this.app.game.players[this.ownerId];
	}
	public set owner(value: DB.Player) {
		this.ownerId = value.id;
	}

	public constructor(public app: App, public model: MRE.Actor) {
		this.index = parseInt(model.name[model.name.length - 1], 10);

		// init nametag
		const nametagModel = model.children.find(a => /^Nametag\d/.test(a.name));
		this.nametag = new Nametag(app, this, nametagModel);

		// init ballot
		this.ballot = new Ballot(app, this);
		this.ballot.askQuestion('Hello world');

		app.game.on('update_turnOrder', () => this.updateOwnership());
	}

	private updateOwnership() {
		const ids = this.app.game.turnOrder;
		const players = this.app.game.players;

		// register this seat if it's newly claimed
		if (!this.ownerId) {
			// check if a player has joined at this seat
			for (let id of ids) {
				if (players[id].seatId === this.index) {
					this.ownerId = id;
					this.nametag.updateText(players[id].displayName);
				}
			}
		}

		// reset this seat if it's newly vacated
		if (!ids.includes(this.ownerId)) {
			this.ownerId = '';
			if (this.app.game.state === DB.State.Setup) {
				this.nametag.updateText();
			}
		}
	}

	private updateConnectionStatus() {
		if (!this.owner.connected) {
			this.nametag.updateText(null, MRE.Color3.Gray());
		}
		else if (this.owner.connected) {
			this.nametag.updateText(null, MRE.Color3.White());
		}
	}
}