module.exports = {
    // send a message to the channel 1051064356026187846 when a user leaves
    // the time is an unix timestamp so like <t:1620000000:R>
    name: Events.GuildMemberAdd,
    async execute(event) {
        console.log(`User ${event.user.tag} joined the guild ${event.guild.name}`);
        
        // TODO wait for the database to be finished so that a welcome message can be sent in the future

    }
};

