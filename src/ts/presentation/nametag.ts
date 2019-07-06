import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Seat } from '.';
import { App } from '..';
import * as DB from '../db';
import { requestJoin, requestLeave, requestKick } from '../logic';

export class Nametag {
	private labels: MRE.Text[];
	private localQuestionAsked = false;

	constructor(public app: App, public seat: Seat, public model: MRE.Actor) {
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
			.onClick(user => this.clicked(user));
	}

	public updateText(text: string = "<Click To Join>", color: MRE.Color3Like = { r: 1, g: 1, b: 1 }) {
		const oldText = this.labels[0].contents;
		this.labels[0].color = color;
		this.labels[0].contents = text || oldText;
		this.labels[1].color = color;
		this.labels[1].contents = text || oldText;
	}

	private clicked(user: MRE.UserLike) {
		if (this.app.game.state !== DB.State.Setup) return;
		// if (!isInUserWhitelist(SH.localUser.id)) return;

		if (!this.seat.owner)
			this.requestJoin(user);
		else if (this.seat.ownerId === user.id)
			this.requestLeave();
		else if (this.app.game.turnOrder.includes(user.id))
			this.requestKick();
	}

	private async requestJoin(user: MRE.UserLike) {
		const p = new DB.Player(user.id);
		p.displayName = user.name;
		p.isModerator = /moderator/.test(user.properties['altspacevr-roles']);
		p.connected = true;
		requestJoin(this.app.game, p, this.seat.index);
	}

	private async requestLeave() {
		if(!this.localQuestionAsked)
		{
			this.localQuestionAsked = true;
			const confirm = await this.seat.ballot.askQuestion('Are you sure you\nwant to leave?', 'local_leave')
			.then(confirm => {
				if(confirm){
					SH.socket.emit('leave', SH.localUser.id);
				}
				self.question = null;
			})
			.catch(() => { self.question = null; });
		}
	}

	private requestKick() {

	}
}