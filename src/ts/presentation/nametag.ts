import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { App } from '..';

export class Nametag {
	private labels: MRE.Text[];

	constructor(public app: App, public model: MRE.Actor) {
		const label1 = MRE.Actor.CreateEmpty(this.app.context, {
			actor: {
				parentId: this.model.id,
				transform: {
					local: {
						position: { x: 0.02, y: 0.01 },
						rotation: MRE.Quaternion.FromEulerAngles(30 * MRE.DegreesToRadians, -Math.PI / 2, 0),
						scale: { x: 0.8, y: 0.8, z: 0.8 }
					}
				},
				text: {
					contents: "<Click To Join>",
					height: 0.04,
					anchor: MRE.TextAnchorLocation.MiddleCenter,
					justify: MRE.TextJustify.Center
				}
			}
		}).value;
		const label2 = MRE.Actor.CreateEmpty(this.app.context, {
			actor: {
				parentId: this.model.id,
				transform: {
					local: {
						position: { x: -0.02, y: 0.01 },
						rotation: MRE.Quaternion.FromEulerAngles(30 * MRE.DegreesToRadians, Math.PI / 2, 0),
						scale: { x: 0.8, y: 0.8, z: 0.8 }
					}
				},
				text: {
					contents: "<Click To Join>",
					height: 0.04,
					anchor: MRE.TextAnchorLocation.MiddleCenter,
					justify: MRE.TextJustify.Center
				}
			}
		}).value;
		this.labels = [label1.text, label2.text];

		this.model.setCollider('box', false, undefined, new MRE.Vector3(0.04, 0.04, 0.2));
		this.model.setBehavior(MRE.ButtonBehavior)
			.onClick('released', user => this.clicked(user));
	}

	private clicked(user: MRE.User) {

	}
}