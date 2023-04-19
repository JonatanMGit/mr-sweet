import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

module.exports = {
    global: false,
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluates code')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('The code to evaluate')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.user.id !== '337853846158180352' && interaction.channel.id !== '1067027149250371646') {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return
        }
        await interaction.deferReply();
        const code = interaction.options.getString('code');
        let res
        try {
            console.log(code);
            res = await eval(code);
        } catch (error) {
            await interaction.editReply({ content: `Error: ${error}` });
        }
        const resEmbed = {
            color: 0x0099ff,
            title: 'Eval',
            fields: [
                {
                    name: 'Code',
                    value: `\`\`\`js\n${code}\`\`\``,
                },
                {
                    name: 'Result',
                    value: `\`\`\`js\n${res}\`\`\``,
                },
            ],
            timestamp: new Date().toISOString(),
        };
        await interaction.editReply({ embeds: [resEmbed] });


    },
};

