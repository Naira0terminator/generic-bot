const qdb = require('quick.db');
const schedule = require('node-schedule');
const modlog = require('./modLogs');

module.exports = class TaskManager {
    constructor(type, time, {message: message = null, member: member = null}) {
        this.time = time;
        this.type = type;
        this.message = message;
        this.member = member;
    }

    set() {
        switch(this.type) {
            case 'mute':
                return this.MuteHandler();
        }
    }

    async MuteHandler() {
        const time = new Date(Date.now() + this.time);

        schedule.scheduleJob(time, async () => {

            const isMuted = await qdb.get(`user[${this.member.id}].moderation.muteData.muted`);
            if(!isMuted) return;
            
            const logChannel = await qdb.get(`guild[${this.message.guild.id}].logChannels.mod`);
            const muteRole = await qdb.get(`muteRole[${this.message.guild.id}]`);
            const getRole = this.message.guild.roles.cache.get(muteRole);
            let removeRoles = await qdb.get(`muteRemove[${this.message.guild.id}]`);

            if(!this.member || !getRole) return;

            for(const role of removeRoles) {
                const r = this.message.guild.roles.cache.get(role);
                if(!r) {
                    removeRoles = removeRoles.filter(id => id === r);
                    qdb.set(`muteRemove[${message.guild.id}]`, removeRoles);
                }
            }

            if(this.member.roles.cache.has(getRole.id))
                await this.member.roles.remove(getRole.id);

            await this.member.roles.remove(getRole.id);
            const premuteRoles = qdb.get(`user[${this.member.id}].premuteRoles`);
            await this.member.roles.add(premuteRoles);

            if(logChannel) {
                const logger = new modlog('unmuted', this.member, this.message, "Mute duration expired!");

                logger.log();
            }
        });
    }
}

