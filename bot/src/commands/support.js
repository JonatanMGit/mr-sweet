client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'support') {
		await interaction.reply({ content: 'discord.gg/jE66NtBZZe', ephemeral: true });
	}
});