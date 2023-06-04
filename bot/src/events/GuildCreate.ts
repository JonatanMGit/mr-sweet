import { Events } from 'discord.js';
import { saveGuild } from '../db';
import { newGuild } from '../invites';

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        console.log("Joined a new guild: " + guild.name + " - " + guild.id + " - " + guild.ownerId);
        // add guild to database
        saveGuild(guild.id, guild.name);
        newGuild(guild);
    }
};