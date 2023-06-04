// this file will handle the invite logging.

import { Collection, Guild, GuildMember, Invite, PermissionFlagsBits } from "discord.js";
import { CustomClient } from ".";

const invites: Collection<string, Collection<string, number>> = new Collection();


export async function updateInvite(client: CustomClient) {
    client.guilds.cache.forEach(async (guild: Guild) => {
        const bot = await guild.members.fetch(client.user.id);

        // check permissions
        if (!bot.permissions.has(PermissionFlagsBits.ManageGuild)) {
            console.log("Missing permissions to update invites");
            return;

        }

        const invite = await guild.invites.fetch();
        // add the invite to the collection (all of the invites)
        invites.set(guild.id, new Collection(invite.map((invite) => [invite.code, invite.uses])));
    }

    );
}

export async function newInvite(invite: Invite) {
    invites.get(invite.guild.id).set(invite.code, invite.uses);
}

export async function deleteInvite(invite: Invite) {
    invites.get(invite.guild.id).delete(invite.code);
}

export async function newGuild(guild: Guild) {
    const invite = await guild.invites.fetch();
    invite.forEach((value) => {
        invites.set(value.guild.id, new Collection([[value.code, value.uses]]));
    }
    );
}

export async function deleteGuild(guild: Guild) {
    invites.delete(guild.id);
}

export function printInvites() {
    for (const [guild, invite] of invites) {
        console.log(guild);
        for (const [code, uses] of invite) {
            console.log(code, uses);
        }
    }
}

export async function newMember(member: GuildMember): Promise<GuildMember | undefined> {
    const newInvites = await member.guild.invites.fetch();
    const oldInvites = await invites.get(member.guild.id);
    const invite = await newInvites.find((inv) => inv.uses > oldInvites.get(inv.code));
    if (!invite) return;
    const inviter = await member.guild.members.cache.get(invite.inviter.id);

    console.log(`${member.user.tag} joined using invite code ${invite.code} from ${inviter.user.tag}. Invite was used ${invite.uses} times since its creation.`);

    // update the invite collection
    invites.get(member.guild.id).set(invite.code, invite.uses);

    return inviter;
}