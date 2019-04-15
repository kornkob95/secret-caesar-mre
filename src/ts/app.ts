import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { log } from '@microsoft/mixed-reality-extension-sdk/built/log';

export class App {
	constructor(public context: MRE.Context, public baseUrl: string, public params: MRE.ParameterSet = {}) {

	}
}
