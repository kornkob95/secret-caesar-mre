import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import * as DB from '../db';
import { App } from '..';
import { bob, spin } from '../util/animate';

export class DisplayArea {
    private banner: MRE.Text;
    private credits: MRE.Actor;
    constructor(public app: App, parent: MRE.Actor) {
        const root = MRE.Actor.CreateEmpty(this.app.context, {
            actor: {
                name: 'presentationRoot',
                parentId: parent.id,
                transform: {
                    local: {
                        position: { x: 0, y: 0.65, z: 0 }
                    }
                },
                text: {
                    height: 0.2,
                    color: MRE.Color3.Black()
                }
            }
        }).value;
        this.banner = root.text;

        const cardsAg = this.app.context.assetManager.groups["cards"];
        this.credits = MRE.Actor.CreateFromPrefab(this.app.context, {
            prefabId: cardsAg.prefabs.byName('Credits').id,
            actor: {
                parentId: root.id,
                transform: { local: { scale: { x: 0.65, y: 0.65, z: 0.65 } } }
            }
        }).value;
        spin(this.credits, 30);

        // create idle display
        /*Animate.spin(this.credits, 30000);

        // create victory banner
        this.banner.billboard = new NBillboard(this.banner);
        this.banner.bob = null;

        // update stuff
        SH.addEventListener('update_state', this.updateOnState.bind(this));*/
    }

    /*updateOnState(game: DB.GameState, players: DB.Player[]) {
        this.banner.visible = false;
        this.credits.visible = false;
        if (this.banner.bob) {
            this.banner.bob.stop();
            this.banner.bob = null;
        }

        if (game.state === 'setup') {
            this.credits.visible = true;
        }
        else if (game.state === 'done') {
            if (/^liberal/.test(game.victory)) {
                this.banner.text.color = '#1919ff';
                this.banner.text.update({ text: 'Liberals win!' });
                SH.audio.liberalFanfare.play();
            }
            else {
                this.banner.text.color = 'red';
                this.banner.text.update({ text: 'Fascists win!' });
                SH.audio.fascistFanfare.play();
            }

            this.banner.position.set(0, 0.8, 0);
            this.banner.scale.setScalar(.001);
            this.banner.visible = true;
            Animate.simple(this.banner, {
                pos: new THREE.Vector3(0, 1.8, 0),
                scale: new THREE.Vector3(1, 1, 1),
                duration: 1000
            })
                .then(() => this.banner.bob = Animate.bob(this.banner));
        }
        else if (game.state === 'policy1' && game.fascistPolicies >= 3) {
            let chancellor = players[game.chancellor].displayName;
            this.banner.text.color = 'white';
            this.banner.text.update({ text: `${chancellor} is not ${tr('Hitler')}!` });

            this.banner.position.set(0, 0.8, 0);
            this.banner.scale.setScalar(.001);
            this.banner.visible = true;
            Animate.simple(this.banner, {
                pos: new THREE.Vector3(0, 1.8, 0),
                scale: new THREE.Vector3(1, 1, 1)
            })
                .then(() => this.banner.bob = Animate.bob(this.banner));
        }

    }*/
}
