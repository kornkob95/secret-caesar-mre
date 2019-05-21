import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import * as DB from '../db';
import generateId from '../util/generateId';

export async function requestJoin(game: DB.GameState, user: MRE.UserLike, seatId: number) {
    // load game state from db
    await game.load();
    await game.loadPlayers();

    // evaluate the join conditions
    const seatTaken = game.turnOrder.findIndex(e => game.players[e].seatId === seatId) >= 0;
    const playerIn = game.turnOrder.includes(user.id);

    // make sure preconditions are met
    if (!(seatId !== null && game.state === DB.State.Setup && !seatTaken && !playerIn)) {
        throw new Error('Player join preconditions failed');
    }

    // create new data structure
    const p = new DB.Player(user.id);
    p.displayName = user.name;
    p.seatId = seatId;
    game.players[user.id] = p;

    // let all players join up to minimum count
    if (game.turnOrder.length < 5) {
        game.turnOrder.push(user.id);
        game.turnOrder.sort((a, b) => game.players[a].seatId - game.players[b].seatId);
        await Promise.all([game.save(), p.save()]);
    }
    // after minimum count, require vote to approve
    else if (game.turnOrder.length < 10) {
        // create new vote
        const vote = new DB.Vote(generateId());
        vote.type = DB.VoteType.Join;
        vote.target = p.id;
        vote.targetName = p.displayName;
        vote.toPass = 1;
        vote.requires = 1;
        game.votesInProgress.push(vote.id);
        await Promise.all([game.save(), p.save(), vote.save()]);
    }
    else {
        throw new Error('Player join failed: room is full');
    }
}

export async function requestLeave(game: DB.GameState, user: MRE.UserLike) {
    const player = new DB.Player(user.id);

    // fetch game and player records from db
    await Promise.all([game.load(), player.load()]);

    // check if player is in game
    let i = game.turnOrder.indexOf(user.id);
    if (i > -1) {
        // if so, remove from game
        game.turnOrder.splice(i, 1);
        await Promise.all([game.save(), player.destroy()]);
    }
}

export async function requestKick(game: DB.GameState, requesterId: string, targetId: string) {
    await game.load();

    // make sure requester, target are in game
    if (game.turnOrder.includes(requesterId) && game.turnOrder.includes(targetId)) {
        // initiate vote to kick
        const vote = new DB.Vote(generateId());
        vote.type = DB.VoteType.Kick;
        vote.target = targetId;
        vote.requires = 2;
        vote.toPass = Math.ceil((game.turnOrder.length - 1) / 2 + 0.1);
        vote.nonVoters = [targetId];
        game.votesInProgress.push(vote.id);
        await Promise.all([game.save(), vote.save()]);
    }
    else {
        throw new Error('Target or requester not valid');
    }
}
