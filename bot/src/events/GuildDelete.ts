import { Events } from 'discord.js';
import { removeGuild } from '../db';

module.exports = {
    name: Events.GuildDelete,
    async execute(guild) {
        console.log("Left a guild: " + guild.name + " - " + guild.id + " - " + guild.ownerId);
        // remove guild from database
        removeGuild(guild.id);
    }
};