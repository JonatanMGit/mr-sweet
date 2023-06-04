import { Events, Invite } from 'discord.js';
import { deleteInvite } from '../invites';
module.exports = {
    name: Events.InviteDelete,
    async execute(invite: Invite) {
        deleteInvite(invite);
    }
};