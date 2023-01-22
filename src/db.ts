// set up database sequelize
const { Sequelize } = require('sequelize');
// set up sqlite database ./database.sqlite
export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

export type User = {
    id: string,
    refresh_token: string
}


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