import { Events, Invite } from 'discord.js';
import { newInvite } from '../invites';
module.exports = {
    name: Events.InviteCreate,
    async execute(invite: Invite) {
        newInvite(invite);
    }
};