class Player extends GameObject {
	constructor(id) {
		super('player', id);

		let defaults = {
			displayName: '',
			isModerator: false,
			seatNum: null,
			role: 'unassigned', // one of 'unassigned', 'hitler', 'fascist', 'liberal'
			state: 'normal' // one of 'normal', 'investigated', 'dead'
		};

		Object.assign(this.propTypes, {
			displayName: 'string',
			isModerator: 'bool',
			seatNum: 'int',
			role: 'string',
			state: 'string'
		});

		this.properties.push(...Object.keys(defaults));
		Object.assign(this.delta, defaults);
	}

	serialize(hideSecrets = false) {
		let safe = super.serialize();
		if (hideSecrets) delete safe.role;
		safe.connected = !!socketForPlayer[this.get('id')];
		return safe;
	}
}