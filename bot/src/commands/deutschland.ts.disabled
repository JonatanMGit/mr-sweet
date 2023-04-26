import { SlashCommandBuilder } from '@discordjs/builders';


const gTTS = require('gtts');
const { joinVoiceChannel } = require('@discordjs/voice');
const { createAudioPlayer } = require('@discordjs/voice');
const { createAudioResource, StreamType } = require('@discordjs/voice');

const player = createAudioPlayer();


const list = ["polen"
    , "deutschland"
    , "frankreich"
    , "england"
    , "italien"
    , "niedersachsen"
    , "fortnite_hymne"
    , "niederlande"
    , "tschechien"
    , "schweiz"
    , "slowakei"];

const polen = `Jeszcze Polska nie zginęła
Kiedy my żyjemy.
Co nam obca przemoc wzięła,
Szablą odbierz
Marsz, marsz, Dąbrowski,
Z ziemi włoskiej do Polski,
 Za twoim przewodem
Złączym się z narodem.
Przejdziem Wisłę, przejdziem Wartę,
Będziem Polakami,
Dał nam przykład Bonaparte,
Jak zwy
Marsz, mar
Jak Czarniecki do Poznania
Po szwedzkim zaborze,
Dla ojczyzny ratowania
Wrócim się przez morze.
Marsz, marsz, Dąbrowski …
Już tam ojciec do swej Basi
Mówi zapłakany:
„Słuchaj jeno, pono nasi
biją w tarabany.“
Marsz, marsz, Dąbrowski`
const deutschland = `Deutschland, Deutschland über alles,
über alles in der Welt,
wenn es stets zum Schutz und Trutze
brüderlich zusammenhält,
von der Maas bis an die Memel,
von der Etsch bis an den Belt -
Deutschland, Deutschland über alles,
 über alles in der Welt!
Deutsche Frauen, deutsche Treue,
 deutscher Wein und deutscher Sang
sollen in der Welt behalten
ihren alten schönen Klang,
uns zu edler Tat begeistern
unser ganzes Leben lang -
deutsche Frauen, deutsche Treue,
deutscher Wein und deutscher Sang!
Einigkeit und Recht und Freiheit
für das deutsche Vaterland!
Danach lasst uns alle streben
brüderlich mit Herz und Hand!
Einigkeit und Recht und Freiheit
sind des Glückes Unterpfand -
blüh im Glanze dieses Glückes, `
// continue for other countries
const frankreich = `La Marseillaise
Allons enfants de la Patrie,
Le jour de gloire est arrivé!
Contre nous de la tyrannie,
L'étendard sanglant est levé,
Entendez-vous dans les campagnes
Mugir ces féroces soldats?
Ils viennent jusque dans vos bras
Égorger vos fils, vos compagnes!
Aux armes, citoyens!
Formez vos bataillons!
Marchons, marchons!
Qu'un sang impur
Abreuve nos sillons!
Fraternité, liberté,
Égalité, ou la mort!
Mort aux Bourbons!
Vive la République!
Allons enfants de la Patrie,
Le jour de gloire est arrivé!
Contre nous de la tyrannie,
L'étendard sanglant est levé,
Entendez-vous dans les campagnes
Mugir ces féroces soldats?
Ils viennent jusque dans vos bras
Égorger vos fils, vos compagnes!
Aux armes, citoyens!
Formez vos bataillons!
Marchons, marchons!
Qu'un sang impur
Abreuve nos sillons!
Fraternité, liberté,
Égalité, ou la mort!
Mort aux Bourbons!
Vive la République!`
// continue for other countries
const england = `
God save our gracious king,
Long live our noble king,
God save the king:
Send her victorious,
Happy and glorious,
Long to reign over us:
God save the king.
O Lord, our God arise,
Scatter her enemies,
And make them fall:
Confound their politics,
Frustrate their knavish tricks,
On Thee our hopes we fix:
God save us all.
O God, our help in ages past,
Our hope for years to come,
Our shelter from the stormy blast,
And our eternal home:
Under the shadow of Thy throne
Thy saints have dwelt secure;
Sufficient is Thine arm alone,
And our defense is sure.
Before the hills in order stood,
Or earth received her frame,
From everlasting Thou art God,
To endless years the same.
A thousand ages in Thy sight
Are like an evening gone;
Short as the watch that ends the night
Before the rising sun.
The busy tribes of flesh and blood,
With all their lives and cares,
Are carried downwards by the flood,
And lost in folls and years.
Time, like an ever rolling stream,
Bears all its sons away;
They fly forgotten, as a dream
Dies at the opening day.
O God, our help in ages past,
Our hope for years to come,
Be Thou our guard while troubles last,
And our eternal home.
`
// continue for other countries
const italien = `
Dio, benedica l'Italia,
Dio, benedica l'Italia,
Dio, benedica l'Italia,
E la gloriosa Repubblica.
Dio, benedica l'Italia,
Dio, benedica l'Italia,
Dio, benedica l'Italia,
E la gloriosa Repubblica.
Sotto il suo manto protettore
Sotto il suo manto protettore
Sotto il suo manto protettore
Vivano i nostri figli e noi.
Sotto il suo manto protettore
Sotto il suo manto protettore
Sotto il suo manto protettore
Vivano i nostri figli e noi.
`

const niedersachsen = `Niedersachsen, Niedersachsen,
Niedersachsen, Niedersachsen,
Niedersachsen, Niedersachsen,
Niedersachsen, Niedersachsen,
Niedersachsen, Niedersachsen,
Niedersachsen, Niedersachsen,
Niedersachsen, Niedersachsen,
`

const niederlande = `Wilhelmus van Nassouwe
ben ik, van Duitsen bloed,
den vaderland getrouwe
blijf ik tot in den dood.
Een Prinse van Oranje
ben ik, vrij, onverveerd,
den Koning van Hispanje
heb ik altijd geëerd.`

const tschechien =
    `
Kde domov můj?
Kde domov můj?
Voda hučí po lučinách,
bory šumí po skalinách,
v sadě skví se jara květ,
zemský ráj to na pohled;
a to je ta krásná země,
země česká, domov můj,
země česká, domov můj!
Kde domov můj?
Kde domov můj?
V kraji znáš-li bohumilém,
duše tiché v těle čilém,
jasnou mysl, vznik a zdar,
a tu sílu, vzdoru zmar?
To je Čechů slavné plémě,
mezi Čechy domov můj,
mezi Čechy domov můj!`

const schweiz = `Schweiz, du heiliges Land,
du heiliges Land,
du heiliges Land,
du heiliges Land,
du heiliges Land,
du heiliges Land,
du heiliges Land,
du heiliges Land,
du heiliges Land,
du heiliges Land,
du heiliges Land,
`

const slowakei = `Himna Slov
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté.
Slovensko, národné divo,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté.
Slovensko, národné divo,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté.
Slovensko, národné divo,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté.
Slovensko, národné divo,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté.
Slovensko, národné divo,
srdce nášho ľudu sväté,
srdce nášho ľudu sväté,enskej republiky
Slovensko, národné divo,
`

const fortnite = `
https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.Wk0PMCyNq2ci6BS7wikaxgHaEK%26pid%3DApi&f=1&ipt=ec0554e7a3bb4503a3a12a998170008b81719e98385e53dfb01c93ba3f083e3d&ipo=images
`



// the max subcommand limit is 25
// Source: https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
module.exports = {
    global: false,
    data: new SlashCommandBuilder()
        .setName('hymne')
        // add bool option
        .setDescription('Gives out the lyrics of many hymnes')
        /// for each country create a new subcommand
        .addSubcommand(subcommand =>
            subcommand
                .setName('deutschland')
                .setDescription('Gives out the lyrics of the german hymne')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('polen')
                .setDescription('Gives out the lyrics of the polish hymne')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('frankreich')
                .setDescription('Gives out the lyrics of the french hymne')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('england')
                .setDescription('Gives out the lyrics of the english hymne')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('italien')
                .setDescription('Gives out the lyrics of the italian hymne')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('niederlande')
                .setDescription('Gives out the lyrics of the dutch hymne')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tschechien')
                .setDescription('Gives out the lyrics of the czech hymne')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('schweiz')
                .setDescription('Gives out the lyrics of the swiss hymne')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('slowakei')
                .setDescription('Gives out the lyrics of the slovak hymne')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('fortnite')
                .setDescription('Gives out the lyrics of the fortnite hymne')
        ),

    async execute(interaction) {
        // get the subcommand name
        const subcommand = interaction.options.getSubcommand();
        // respond with the correct hymne using the subcommand name as the variable
        // if the user is in a vc then join the voice channel
        /*
        const Player = createAudioPlayer();
        var gtts = new gTTS(eval(subcommand), 'en');
        gtts.save('./src/commands/hymne.mp3')

        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        try {
            connection;
            connection.subscribe(Player);

            const resource = createAudioResource('./src/commands/hymne.mp3');

            Player.play(resource);
        } catch (error) {
            console.log(error);
        }
*/

        await interaction.reply(eval
            (subcommand));


    }
    ,
};