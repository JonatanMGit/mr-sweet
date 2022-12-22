const { SlashCommandBuilder } = require('@discordjs/builders');
const { faker } = require('@faker-js/faker')
const offset = 30000;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('hack')
        .setDescription('Hacks a user')
        .addUserOption(option => option.setName('user').setDescription('The user to hack').setRequired(true))
        .addBooleanOption(option => option.setName('verbose').setDescription('Whether to show more hacked data').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        console.log(user)
        // create a discord timestamp
        await interaction.reply(`Hacking ${user.username} in <t:${Math.floor((Date.now() + offset) / 1000)}:R>`);
        // wait 1 minute
        setTimeout(async () => {
            // edit the message to look like this
            // User: <@!user id>
            // IP:
            // Password:
            // Email:
            // Credit Card:
            // Bank Account:
            // Social Security Number:
            // Address:
            // Phone Number:
            // Date of Birth:
            // Mother's Maiden Name:
            // Favorite Color:
            // Favorite Food:
            // Favorite Animal:
            // Favorite Movie:
            // Favorite TV Show:
            // Discord login token: (This is the base64 of the user id)

            // generate random data for each field using faker
            content = `User: <@!${user.id}>
IP: ${faker.internet.ip()}
Password: ${faker.internet.password()}
Email: ${faker.internet.email()}
First part of the Discord login token: ${Buffer.from(user.id).toString('base64')}`

            if (interaction.options.getBoolean('verbose')) {
                content += `Credit Card: ${faker.finance.creditCardNumber()}
Bank Account: ${faker.finance.iban()}
Social Security Number: ${faker.finance.account()}
Address: ${faker.address.streetAddress()}
Phone Number: ${faker.phone.number()}
Date of Birth: ${faker.date.past()}
Mother's Maiden Name: ${faker.name.lastName()}
Favorite Color: ${faker.color.human()}
Favorite Food: ${faker.commerce.productName()}
Favorite Animal: ${faker.animal.dog()}
            `};

            await interaction.editReply({
                content: content
            });
        }, offset);

    },
};
