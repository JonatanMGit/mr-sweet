import { SlashCommandBuilder } from '@discordjs/builders';
import { getAutocomplete, getDefinition, getRandom, getWordsOfTheDay, replaceTermsWithLinks } from '../urbanLib';
import { AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
    global: false,
    data: new SlashCommandBuilder()
        .setName('urban')
        .setDescription('Gets information from the urban dictionary')
        .addSubcommand(subcommand =>
            subcommand.setName('definition')
                .setDescription('Gets the definition of a word')
                .addStringOption(option =>
                    option.setName('term')
                        .setDescription('The term to search for')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('random')
                .setDescription('Gets a random definition')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('words_of_the_day')
                .setDescription('Gets the words of the day')
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        // handle each subcommand
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'definition') {
            const term = interaction.options.getString('term', true);
            const definition = await getDefinition(term);


            let description = "**Definition:**\n";
            // replace every [] with a link to https://www.urbandictionary.com/define.php?term=word
            description += await replaceTermsWithLinks(definition.list[0].definition);

            let example = "";
            // replace every [] with a link to https://www.urbandictionary.com/define.php?term=word
            example += await replaceTermsWithLinks(definition.list[0].example);

            const embed = new EmbedBuilder()
                .setTitle(definition.list[0].word)
                .setURL(definition.list[0].permalink)
                .setDescription(description)
                .addFields(
                    { name: 'Example', value: example },
                    { name: 'Author', value: definition.list[0].author },
                    { name: 'Written', value: `<t:${Math.floor(new Date(definition.list[0].written_on).getTime() / 1000)}:R>` },
                )
                .setFooter({ text: `👍 ${definition.list[0].thumbs_up} 👎 ${definition.list[0].thumbs_down}` })
                .setColor('Random')
                .setAuthor({
                    "name": definition.list[0].author, "url": "https://www.urbandictionary.com/author.php?author=" + definition.list[0].author,
                    "iconURL": "https://www.urbandictionary.com/android-chrome-512x512.png"
                })
            await interaction.reply({ embeds: [embed] });
        }
        else if (subcommand === 'random') {



            const random = await getRandom();

            let description = "**Definition:**\n";
            description += await replaceTermsWithLinks(random.list[0].definition);

            let example = "";
            example += await replaceTermsWithLinks(random.list[0].example);

            const embed = new EmbedBuilder()
                .setTitle(random.list[0].word)
                .setURL(random.list[0].permalink)
                .setDescription(description)
                .addFields(
                    { name: 'Example', value: example },
                    { name: 'Author', value: random.list[0].author },
                    { name: 'Written', value: `<t:${Math.floor(new Date(random.list[0].written_on).getTime() / 1000)}:R>` },
                )
                .setFooter({ text: `👍 ${random.list[0].thumbs_up} 👎 ${random.list[0].thumbs_down}` })
                .setColor('Random')
                .setAuthor({
                    "name": random.list[0].author, "url": "https://www.urbandictionary.com/author.php?author=" + random.list[0].author,
                    "iconURL": "https://www.urbandictionary.com/android-chrome-512x512.png"
                })
            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'words_of_the_day') {

            const wordsOfTheDay = await getWordsOfTheDay();

            let description = "";
            for (let i = 0; i < wordsOfTheDay.list.length; i++) {
                description += `**${wordsOfTheDay.list[i].word}**\n`;
                description += await replaceTermsWithLinks(wordsOfTheDay.list[i].definition);
                description += `\n\n`;
            }

            const embed = new EmbedBuilder()
                .setTitle('Words of the Day')
                .setURL('https://www.urbandictionary.com/')
                .setDescription(description)
                .setColor('Random')
                .setAuthor({
                    "name": "Urban Dictionary", "url": "https://www.urbandictionary.com/",
                    "iconURL": "https://www.urbandictionary.com/android-chrome-512x512.png"
                })
            await interaction.reply({ embeds: [embed] });

        }
    },
    async autocomplete(interaction: AutocompleteInteraction) {
        const term = interaction.options.getString('term', true);
        const autocomplete = await getAutocomplete(term);
        await interaction.respond(
            autocomplete.map(result => ({ name: result, value: result })),
        )

    }

}

