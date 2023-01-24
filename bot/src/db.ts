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
    refresh_token: string
}
export type Settings = {
    enabled_commands: string,
}

// create the guild table
export const Guild = sequelize.define('Guild', {
    // Model attributes are defined here
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    }
});

// make an table for settings for each guild with the guild id as a foreign key
export const Settings = sequelize.define('Settings', {
    // Model attributes are defined here
    enabled_commands: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Guild: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: Guild,
            key: 'id'
        }
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
        allowNull: false
    }
});

export const saveUser = async (id, refresh_token) => {
    sequelize.sync();
    // check if user already exists in the database with the same id and update refresh token if yes

    const prevUser
        = await User.findOne({
            where: {
                id: id,
            }
        });
    if (prevUser) {
        console.log("User already exists in database");
        prevUser.refresh_token = refresh_token;
        prevUser.save();
        return;
    }
    // create a new user if not
    const user = new User({
        id: id,
        refresh_token: refresh_token
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

export const getUsers = async () => {
    sequelize.sync();
    const users = await User.findAll();
    return users;
}

export const getUser = async (id) => {
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



export const saveGuild = async (id) => {
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
        return;
    }
    // create a new guild if not
    const guild = new Guild({
        id: id
    });
    guild.save()
        .then(() => {
            console.log("Guild added to database");
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

export const getGuild = async (id) => {
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

export const getGuilds = async () => {
    sequelize.sync();
    const guilds = await Guild.findAll();
    return guilds;
}
