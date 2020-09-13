const Sequalize = require('sequelize');

const squalize = new Sequalize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'Tags.sqlite',
});


const Tags = squalize.define('tags', {
    name: {
        type: Sequalize.STRING,
        unique: true,

    },
    description: Sequalize.TEXT,
    username: Sequalize.STRING,
    userID: Sequalize.STRING,
    usage_count: {
        type: Sequalize.INTEGER,
        defaultValue: 0,
		allowNull: false,
    },
});

module.exports = Tags;