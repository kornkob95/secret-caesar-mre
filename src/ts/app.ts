import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import * as DB from './db';

import { Seat, DisplayArea, Table, layOutGame } from './presentation';

export class App {
	public game: DB.GameState;
	public table: Table;
	public displayArea: DisplayArea;
	public seats: Seat[];

	constructor(public context: MRE.Context, public baseUrl: string, public params: MRE.ParameterSet = {}) {
		this.game = new DB.GameState(context.sessionId);
		context.onStarted(() => this.start());
		context.onStopped(() => this.stop());
		context.onUserJoined(user => this.updatePlayerConnectionStatus(user, true));
		context.onUserLeft(user => this.updatePlayerConnectionStatus(user, false));
	}

	public async start() {
		const [cardAg, tableAg] = await Promise.all([
			this.context.assetManager.loadGltf('cards', `${this.baseUrl}/models/cards.gltf`),
			this.context.assetManager.loadGltf('table', `${this.baseUrl}/models/table.gltf`)
		]);
		layOutGame(this);
	}

	public stop() {

	}

	public updatePlayerConnectionStatus(user: MRE.User, status: boolean) {
		const player = this.game.players[user.id];
		if (player) {
			player.connected = status;
			player.save();
		}
	}
}
