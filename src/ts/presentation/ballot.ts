import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Seat } from '.';
import { App } from '..';
import * as DB from '../db';

export enum BallotType {
	PlayerSelect = 0,
	Confirm,
	Binary,
	Policy
}

type QuestionOptions = {
	choices: BallotType,
	policyHand: DB.Policy[],
	includeVeto: boolean,
	fake: boolean,
	isInvalid: () => boolean
}

export class Ballot {
	public root: MRE.Actor;
	public question: MRE.Text;
	public jaCard: MRE.Actor;
	public neinCard: MRE.Actor;

	public displayed = false;

	public constructor(public app: App, public seat: Seat) {
		this.app = app;
		this.seat = seat;

		this.root = MRE.Actor.CreateEmpty(this.app.context, { actor: {
			name: `Ballot${this.seat.index}`,
			parentId: this.seat.model.id,
			transform: { local: {
				position: { x: 0, y: -0.3, z: -0.25 },
				rotation: MRE.Quaternion.FromEulerAngles(.5, Math.PI, 0)
			}}
		}}).value;

		const cardsAg = this.app.context.assetManager.groups["cards"];
		this.jaCard = MRE.Actor.CreateFromPrefab(this.app.context, {
			prefabId: cardsAg.prefabs.byName('Ja').id,
			actor: {
				name: 'Ja',
				parentId: this.root.id,
				transform: { local: {
					position: { x: -0.1, y: -0.1, z: 0 },
					rotation: { x: 0, y: 1, z: 0, w: 0 },
					scale: { x: 0.15, y: 0.15, z: 0.15 }
				}},
				appearance: { enabled: false }
			}
		}).value;
		this.neinCard = MRE.Actor.CreateFromPrefab(this.app.context, {
			prefabId: cardsAg.prefabs.byName('Nein').id,
			actor: {
				name: 'Nein',
				parentId: this.root.id,
				transform: { local: {
					position: { x: 0.1, y: -0.1, z: 0 },
					rotation: { x: 0, y: 1, z: 0, w: 0 },
					scale: { x: 0.15, y: 0.15, z: 0.15 }
				}},
				appearance: { enabled: false }
			}
		}).value;

		const textActor = MRE.Actor.CreateEmpty(this.app.context, { actor: {
			name: 'Question',
			parentId: this.root.id,
			transform: { local: { position: { x: 0, y: 0.1, z: 0 }}},
			text: {
				contents: 'Placeholder',
				height: 0.07,
				anchor: MRE.TextAnchorLocation.MiddleCenter,
				justify: MRE.TextJustify.Center,
				color: MRE.Color3.Black()
			}
		}}).value;
		this.question = textActor.text;
	}

	public askQuestion(qText: string, id: string, opt: Partial<QuestionOptions> = { }) {
		const defaults: QuestionOptions = {
			choices: BallotType.Binary,
			policyHand: [],
			includeVeto: false,
			fake: false,
			isInvalid: () => true };
		opt = { ...defaults, ...opt };

		this.question.contents = qText;
		this.jaCard.appearance.enabled = true;
		this.neinCard.appearance.enabled = true;
	}
}