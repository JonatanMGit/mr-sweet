
// set up database sequelize
import { Sequelize, DataType, Table, Column, Model } from 'sequelize-typescript';
import * as path from 'path';
import { table } from 'console';
import { message } from 'noblox.js';
import { Message } from 'discord.js';
// set up sqlite database ./database.sqlite

const rootDir = path.resolve(__dirname, '../database.sqlite');
export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: rootDir,
    logging: false
});
console.log("Database path: " + rootDir);

// set up database models
@Table
export class User extends Model {
    @Column({
        primaryKey: true,
    })
    declare id: string;

    @Column
    refresh_token: string;

    @Column
    openai_request_count: number;

    @Column
    commands_used: number;

    @Column
    v3tokens_used: number;

    @Column
    v4tokens_prompt_used: number;

    @Column
    v4tokens_completion_used: number;
}

@Table
export class Guild extends Model {
    @Column({
        primaryKey: true,
    })
    declare id: string;

    @Column
    name: string;
}


@Table
export class Settings extends Model {
    @Column({
        primaryKey: true,
    })
    declare id: string;

    @Column
    enabledCommands: string;
}

@Table
export class Messages extends Model {
    @Column({
        primaryKey: true,
    })
    declare message_id: string;

    @Column
    user_id: string;

    @Column
    guild_id: string;

    @Column
    channel_id: string;

    @Column
    content: string;

}

// register models
sequelize.addModels([User, Guild, Settings, Messages]);


export const saveUser = async (options: User) => {
    sequelize.sync();
    // check if user already exists in the database with the same id and update refresh token if yes

    const prevUser
        = await User.findOne({
            where: {
                id: options.id,
            }
        });
    if (prevUser) {
        console.log("User already exists in database");
        if (options.refresh_token != null) {
            prevUser.refresh_token = options.refresh_token;
            prevUser.save();
        }
        return;
    }
    // create a new user if not
    const user = new User({
        id: options.id,
        refresh_token: options.refresh_token,
    });
    // export promise
    user.save()
        .then(() => {
            console.log("User added to database");
        }
        ).catch(err => {
            console.log(err);
        }
        );
}

export const getUsers = async (): Promise<User[]> => {
    sequelize.sync();
    const users = await User.findAll();
    users.forEach(user => {
        user = user.dataValues;
    });
    return users;
}

export const getUser = async (id: number | string): Promise<User> => {
    sequelize.sync();
    const user
        = await User.findOne({
            where: {
                id: id,
            }
        });
    return user;
}

export const deleteUser = async (id) => {

    const user
        = await User
            .findOne({
                where: {
                    id: id,
                }
            });
    if (user) {
        user.destroy();
    }
}



export const saveGuild = async (id, name) => {
    sequelize.sync();
    // check if guild already exists in the database with the same id and update refresh token if yes

    const prevGuild
        = await Guild
            .findOne({
                where: {
                    id: id,
                }
            });
    if (prevGuild) {
        console.log("Guild already exists in database");
        // update guild name
        prevGuild.name = name;
        prevGuild.save();
        return;
    }
    // create a new guild if not
    const guild = new Guild({
        id: id,
        name: name
    });
    guild.save()
        .then(() => {
            console.log("Guild added to database");
            createSettings(id);
        }
        ).catch(err => {
            console.log(err);
        }
        );
}

export const removeGuild = async (id) => {

    const guild
        = await Guild
            .findOne({
                where: {
                    id: id,
                }
            });
    if (guild) {
        guild.destroy();
    }
}

export const getGuild = async (id: string): Promise<Guild> => {
    sequelize.sync();
    const guild
        = await Guild
            .findOne({
                where: {
                    id: id,
                }
            });
    return guild;
}

export const getGuilds = async (): Promise<Guild[]> => {
    sequelize.sync();
    const guilds = await Guild.findAll();
    return guilds;
}

// set up database schema if not already set up
sequelize.sync()
    .then(() => {
        console.log("Database schema created");
    }
    ).catch(err => {
        console.log(err);
    }
    );

function createSettings(guildId: string) {
    const settings = new Settings({
        id: guildId,
        enabled_commands: "[]"
    });
    settings.save()
        .then(() => {
            console.log("Settings added to database");
        }
        ).catch(err => {
            console.log(err);
        }
        );
}

// update the database schema if it has changed
if (process.env.NODE_ENV == 'development')
    sequelize.sync({ alter: true })
        .then(() => {
            console.log("Database schema updated");
        }
        ).catch(err => {
            console.log(err);
        }
        );

export const getSettings = async (guildId: string) => {
    sequelize.sync();
    const settings
        = await Settings
            .findOne({
                where: {
                    id: guildId,
                }
            });
    return settings;
}

export const getAllSettings = async (): Promise<Settings[]> => {
    sequelize.sync();
    const settings = await Settings.findAll();
    return settings;
}

export const count_openai_request = async (id) => {
    sequelize.sync();
    const user
        = await User
            .findOne({
                where: {
                    id: id,
                }
            });
    if (user) {
        user.openai_request_count += 1;
        user.save();
    } else {
        console.log("User not found");
        create_user(id);
    }
}

export const count_commands = async (id) => {
    sequelize.sync();
    const user
        = await User
            .findOne({
                where: {
                    id: id,
                }
            });
    if (user) {
        user.commands_used += 1;
        user.save();
    } else {
        console.log("User not found");
        const user = await create_user(id);
        user.commands_used += 1;
        user.save();
    }
}

export const create_user = async (id) => {
    sequelize.sync();
    const user = new User({
        id: id,
        refresh_token: null,
        v3tokens_used: 0,
        v4tokens_prompt_used: 0,
        v4tokens_completion_used: 0,
        openai_request_count: 0,
    });
    user.save()
        .then(() => {
            console.log("User added to database");

        }
        ).catch(err => {
            console.log(err);
        }
        );
    return user;
}


export const count_v3tokens = async (id: string, tokens: number) => {
    sequelize.sync();
    const user
        = await User
            .findOne({
                where: {
                    id: id,
                }
            });
    if (user) {
        user.v3tokens_used += tokens;
        user.save();
    } else {
        console.log("User not found");
        create_user(id);
    }
}

export const count_v4tokens = async (id: string, tokens: number) => {
    sequelize.sync();
    const user
        = await User
            .findOne({
                where: {
                    id: id,
                }
            });
    if (user) {
        user.v4tokens_completion_used += tokens;
        user.save();
    } else {
        console.log("User not found");
        create_user(id);
    }
}

export const new_Messages = async (message: Message) => {
    sequelize.sync();
    // check if unique message id
    const prevMessage
        = await Messages
            .findOne({
                where: {
                    message_id: message.id,
                }
            });
    if (prevMessage) {
        console.log("Message already exists in database");
        return;
    }

    const dbmessage = new Messages({
        message_id: message.id,
        user_id: message.author.id,
        guild_id: message.guild.id,
        channel_id: message.channel.id,
        content: message.content
    });
    dbmessage.save()
}

export const getMessages = async (guildId: string): Promise<Messages[]> => {
    sequelize.sync();
    const messages = await Messages.findAll({
        where: {
            guild_id: guildId,
        }
    });
    return messages;
}

export const getMessagesByChannel = async (channelId: string): Promise<Messages[]> => {
    sequelize.sync();
    const messages = await Messages.findAll({
        where: {
            channel_id: channelId,
        }
    });
    return messages;
}
