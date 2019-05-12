import * as MRE from '@microsoft/mixed-reality-extension-sdk';

export function bob(actor: MRE.Actor, amplitude = .08, period = 4000) {
	const keyframes: MRE.AnimationKeyframe[] = [];


	actor.createAnimation('bob', {
		keyframes,
		wrapMode: MRE.AnimationWrapMode.Loop,
		initialState: {
			enabled: true
		}
	});
}

export function spin(actor: MRE.Actor, period = 10000) {
	actor.createAnimation('spin', {
		keyframes: [
			{
				time: 0,
				value: {
					transform: { local: { rotation: MRE.Quaternion.FromEulerAngles(0, 0, 0) } }
				}
			},
			{
				time: period / 3,
				value: {
					transform: { local: { rotation: MRE.Quaternion.FromEulerAngles(0, 0.666 * Math.PI, 0) } }
				}
			},
			{
				time: 2 * period / 3,
				value: {
					transform: { local: { rotation: MRE.Quaternion.FromEulerAngles(0, 1.333 * Math.PI, 0) } }
				}
			},
			{
				time: period,
				value: {
					transform: { local: { rotation: MRE.Quaternion.FromEulerAngles(0, 2 * Math.PI, 0) } }
				}
			}
		],
		wrapMode: MRE.AnimationWrapMode.Loop,
		initialState: {
			enabled: true
		}
	});
}