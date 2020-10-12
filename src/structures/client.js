const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } = require('discord-akairo');
const config = require('../../config.json');
const readyEvent = require('../listeners/client/ready');
const redis = require('./redis');
const qdb = require('quick.db');
const sleep = require('util').promisify(setTimeout);
const modLogger = require('./modLogs.js');
const taskManager = require('./taskManager.js');

module.exports = class Client extends AkairoClient {
    constructor() {
        super({
            ownerID: config.ownerID,

        },{disableMentions: 'everyone'});

        this.commandHandler = new CommandHandler(this, {
            directory: './src/commands/',
            prefix: async message => {
                if(message.guild) {
                    let prefix = this.config.prefix;
                    if(this.qdb.has(`guild[${message.guild.id}].prefix`)) prefix = this.qdb.get(`guild[${message.guild.id}].prefix`);
                    return prefix;
                }
                return config.prefix;
            },
            aliasReplacement: /-/g,
            storeMessages: true,
            handleEdits: true,
            allowMention: true,
            commandUtil: true,
            commandUtilLifetime: 120000,
            defaultCooldown: 1000,
            automateCategories: true,
            fetchMembers: true,
        }),

        this.listenerHandler = new ListenerHandler(this, {
            directory: './src/listeners/'
        });

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: './src/inhibitor'
        });

        this.commandHandler.useListenerHandler(this.listenerHandler);

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler
        });
        
        this.listenerHandler.load(readyEvent);

        this.snipes = new Map();
        this.queue = new Map();
        this.newMember = new Map();
        this.msgCache = new Map();
        this.redis = redis;
        this.qdb = qdb;
        this.config = config;
        this.modLog = modLogger;
        this.taskManager = taskManager;


        this.resolve = (type, object, guild) => {
            switch(type) {
                case 'role':
                    return guild.roles.cache.get(object);
                case 'channel':
                    return guild.channels.cache.get(object);
                case 'member':
                    return guild.members.cache.get(object);    
            }
        }

        this.sleep = time => sleep(time);

        this.start = () => {
            console.log('attempting to login...');
            try {
                return this.login(config.token);  
            } catch(err) {
                console.log(`there was an error loging in ${err}`)
            }
        }
    }
}