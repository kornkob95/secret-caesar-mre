class Vote extends GameObject {
	constructor(id) {
		super('vote', id);

		let defaults = {
			type: 'elect', // one of 'elect', 'join', 'kick', 'reset', 'confirmRole', 'tutorial'
			target1: '', // userId of president/joiner/kicker
			target2: '', // userId of chancellor
			data: '', // display name of join requester

			toPass: 1, // number of yea votes needed to pass
			requires: 1, // number of total votes before evaluation
			yesVoters: [], // CSV of userIds that voted yes
			noVoters: [], // CSV of userIds that voted no
			nonVoters: [] // CSV of userIds that are not allowed to vote
		};

		Object.assign(this.propTypes, {
			type: 'string',
			target1: 'string',
			target2: 'string',
			data: 'string',

			toPass: 'int',
			requires: 'int',
			yesVoters: 'csv',
			noVoters: 'csv',
			nonVoters: 'csv'
		});

		this.properties.push(...Object.keys(defaults));
		Object.assign(this.delta, defaults);
	}
}