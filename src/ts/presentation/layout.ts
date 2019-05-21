import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { App } from '../app';
import { DisplayArea, Nametag, Table } from '.';

export async function layOutGame(app: App) {
    const tablePrefab = app.context.assetManager.groups['table'].prefabs.byIndex(0);

    const tableRoot = await MRE.Actor.CreateFromPrefab(app.context, {
        prefabId: tablePrefab.id
    });
    
    const tableActor = tableRoot.findChildrenByName('Table', false)[0];
    app.table = new Table(app, tableActor);
    app.displayArea = new DisplayArea(app, app.table.model);

    const nametagRoot = tableRoot.findChildrenByName('Nameplates', false)[0];
    const nametagModels = nametagRoot.children.sort((a, b) => a.name < b.name ? -1 : 1);

    app.nametags = [];
    for (const model of nametagModels) {
        app.nametags.push(new Nametag(app, model));
    }
}