import { Events, GuildMember, TextChannel } from "discord.js";
import createWelcomeGif from '../image';
import { newMember } from "../invites";

module.exports = {
    // send a message to the channel 1051064356026187846 when a user leaves
    // the time is an unix timestamp so like <t:1620000000:R>
    name: Events.GuildMemberAdd,
    async execute(member: GuildMember) {
        console.log(`User ${member.user.tag} joined the guild ${member.guild.name}`);

        // TODO wait for the database to be finished so that a welcome message can be sent in the future

        // currently just send a message to the channel if its the guild 813852446069751838
        if (member.guild.id === "813852446069751838") {
            //console.log("Sending welcome message");

            const channel = member.guild.channels.cache.get("813852446069751842") as TextChannel;
            // console.log(typeof createWelcomeGif);

            const buffer = await createWelcomeGif(member.user);

            console.log("Senwdwdawdwawa");

            // console.log(buffer);

            // get the meber who invited the user
            const inviter = await newMember(member);

            const inviteText = inviter ? `You were invited by <@${inviter.id}>` : "";

            console.log("fnaf");

            channel.send({
                content: `Welcome to the server <@${member.user.id}>! ${inviteText}`,
                allowedMentions: { parse: [] },
                files: [{
                    attachment: buffer,
                    name: "welcome.gif"
                }]
            });
        }
    },
};