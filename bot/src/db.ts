import { ForeignKeyConstraintError } from "sequelize";

// set up database sequelize
const { Sequelize } = require('sequelize');
const rootDir = require('path').resolve('../database.sqlite');
// set up sqlite database ./database.sqlite
export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: rootDir,
    logging: false
});
console.log("Database path: " + rootDir);

export type User = {
    id: string,
    refresh_token?: string
    openai_request_count: number
    commands_used: number
    v3tokens_used: number
    v4tokens_used: number
    costs: number
}
export type Settings = {
    Guild: string,
    enabled_commands: string,
}

export type Guild = {
    id: number,
    name: string
}

// create the guild table
export const Guild = sequelize.define('Guild', {
    // Model attributes are defined here
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    }, name: {
        type: Sequelize.STRING,
        allowNull: false
    }

});

// make an table for settings for each guild with the guild id as a foreign key
export const Settings = sequelize.define('Settings', {
    // Model attributes are defined here
    id: {
        // id of guild is the primary key
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            // This is a reference to another model
            model: Guild,
            key: 'id'
        }
    },
    enabled_commands: {
        type: Sequelize.STRING,
        allowNull: false
    }
});


// create the user table
export const User = sequelize.define('User', {
    // Model attributes are defined here
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    refresh_token: {
        type: Sequelize.STRING,
        allowNull: true
    },
    openai_request_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    commands_used: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
    ,
    v3tokens_used: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
    ,
    v4tokens_used: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
});

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
        v4tokens_used: 0,
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
        user.v4tokens_used += tokens;
        user.save();
    } else {
        console.log("User not found");
        create_user(id);
    }
}