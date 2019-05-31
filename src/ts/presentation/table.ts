import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { App } from '..';

export class Table {
    public textures: MRE.Texture[];
    constructor(public app: App, public model: MRE.Actor) {
        const ag = app.context.assetManager.groups.table;
        this.textures = [
            ag.textures.byName('BoardSmall'),
            ag.textures.byName('BoardMedium'),
            ag.textures.byName('BoardLarge')
        ];
    }
}