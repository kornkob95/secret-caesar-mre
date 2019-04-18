import * as MRE from '@microsoft/mixed-reality-extension-sdk';

export class App {
	constructor(public context: MRE.Context, public baseUrl: string, public params: MRE.ParameterSet = {}) {
		context.onStarted(() => this.start());
		context.onStopped(() => this.stop());
		context.onUserJoined(user => this.userJoin(user));
		context.onUserLeft(user => this.userLeft(user));
	}

	public start() {

	}

	public stop() {

	}

	public userJoin(user: MRE.User) {

	}

	public userLeft(user: MRE.User) {

	}
}
