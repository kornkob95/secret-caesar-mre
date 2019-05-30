import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Nametag } from '.';
import { App } from '..';

export class Seat {
    public nametag: Nametag;
    public constructor(public app: App, public model: MRE.Actor) {
        // init nametag
        const nametagModel = model.children.find(a => /^Seat\d/.test(a.name));
        this.nametag = new Nametag(app, nametagModel);
    }
}