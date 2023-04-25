//https://gist.github.com/GeneralSadaf/42d91a2b6a93a7db7a39208f2d8b53ad
const DISCORD_APPLICATIONS = [
	{ id: '880218394199220334', name: 'Watch Together', nitro_requirement: false, premium_tier_level: 0, max_participants: -1, use: true },
	{ id: '902271654783242291', name: 'Sketch Heads', nitro_requirement: false, premium_tier_level: 0, max_participants: 8, use: true },
	{ id: '879863976006127627', name: 'Word Snacks', nitro_requirement: false, premium_tier_level: 0, max_participants: 8, use: true },
	{ id: '878067389634314250', name: 'Doodle Crew', nitro_requirement: false, premium_tier_level: 0, max_participants: 16, use: true }, // not in Discord Games Lab guild
	{ id: '755827207812677713', name: 'Poker Night', nitro_requirement: false, premium_tier_level: 1, max_participants: 7, use: true },
	{ id: '832012774040141894', name: 'Chess In The Park', nitro_requirement: false, premium_tier_level: 1, max_participants: -1, use: true },
	{ id: '879863686565621790', name: 'Letter League', nitro_requirement: false, premium_tier_level: 1, max_participants: 8, use: true },
	{ id: '852509694341283871', name: 'SpellCast', nitro_requirement: false, premium_tier_level: 1, max_participants: 6, use: true },
	{ id: '832013003968348200', name: 'Checkers In The Park', nitro_requirement: false, premium_tier_level: 1, max_participants: -1, use: true },
	{ id: '832025144389533716', name: 'Blazing 8s', nitro_requirement: false, premium_tier_level: 1, max_participants: 8, use: true },
	{ id: '945737671223947305', name: 'Putt Party', nitro_requirement: false, premium_tier_level: 1, max_participants: 8, use: true },
	{ id: '903769130790969345', name: 'Land-io', nitro_requirement: false, premium_tier_level: 1, max_participants: 16, use: true },
	{ id: '947957217959759964', name: 'Bobble League', nitro_requirement: false, premium_tier_level: 1, max_participants: 8, use: true },
	{ id: '976052223358406656', name: 'Ask Away', nitro_requirement: false, premium_tier_level: 1, max_participants: 10, use: true },
	{ id: '950505761862189096', name: 'Know What I Meme', nitro_requirement: false, premium_tier_level: 1, max_participants: 8, use: true },

	// not public
	{ id: '773336526917861400', name: 'Betrayal.io', nitro_requirement: false, premium_tier_level: 0, max_participants: null, use: false },
	{ id: '814288819477020702', name: 'Fishington.io', nitro_requirement: false, premium_tier_level: 0, max_participants: null, use: false },
	{ id: '879864070101172255', name: 'Sketchy Artist', nitro_requirement: false, premium_tier_level: 0, max_participants: 12, use: false },
	{ id: '879863881349087252', name: 'Awkword', nitro_requirement: false, premium_tier_level: 0, max_participants: 12, use: false },
];

import { SlashCommandBuilder } from '@discordjs/builders';
import { APIApplicationCommandOptionChoice, CommandInteraction } from 'discord.js';
// const fetch = require("node-fetch");
let choises = [];

for (const application of DISCORD_APPLICATIONS) {
	if (application.use) {
		const choice: APIApplicationCommandOptionChoice<string> = {
			name: application.name,
			value: application.id
		};
		choises.push(choice);

	}
}

let command = new SlashCommandBuilder()
	.setName('activities')
	.setDescription('Start an activity with your friends!')
	.addStringOption(option => {
		option.setName('activity')
			.setDescription('The activity you want to start')
			.setRequired(true)

		for (const choice of choises) {
			const cur_choice = {
				"name": choice.name, "value": choice.value
			}
			option.addChoices(cur_choice)
		}
		return option;
	});


// add every choice as an array of [name, name]
module.exports = {
	global: true,
	data: command,
	async execute(interaction: CommandInteraction) {
		// generate a new invite for the activity using the activity id from the option
		// @ts-ignore
		const invite = await activityInvite(interaction.options.getString('activity', true), interaction.channelId);


		// send the invite to the channel
		await interaction.reply(`https://discord.gg/${invite.code}`);
	},
};


async function activityInvite(applicationId: string, channelId: string) {
	const invite = await fetch(`https://discord.com/api/v8/channels/1055955436643287071/invites`, {
		method: 'POST',
		body: JSON.stringify({
			max_age: 86400,
			max_uses: 0,
			target_application_id: applicationId,
			target_type: 2,
			temporary: false,
			validate: null,
		}),
		headers: {
			"Authorization": `Bot ${process.env.TOKEN}`,
			"Content-Type": "application/json",
		},
	});
	return invite.json();
}