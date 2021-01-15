require('./keepAlive');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.google_api);
const {Client, MessageEmbed, Collection} = require('discord.js');
const config = require('./config')
const client = new Client({
	partials: [`MESSAGE`, `USER`, `REACTION`, `CHANNEL`, `GUILD_MEMBER`, `GUILD_PRESENCES`],
	presence: {
    status: config.status.status,
    activity: {
      name: config.status.game,
      type: config.status.type
    }
	},
	ws: { properties: { $browser: "Discord iOS" } }
})

const fs = require('fs');
const ms = require('ms')
const moment = require('moment')
const momentz = require('moment-timezone')
const chalk = require('chalk');
const log = (level=null, string) => {
	let d = new Date();
	let myTimezone = "America/Toronto";
	let myDatetimeFormat= "YYYY-MM-DD hh:mm:ss A z";
	let time = momentz(d).tz(myTimezone).format(myDatetimeFormat);
	if(level.toLowerCase() == 'info'){
		console.log(`${chalk.green(`[INFO: ${time}]`)} - ${string}`)
	}else if(level.toLowerCase() == 'error'){
		console.log(`${chalk.red(`[ERROR: ${time}]`)} - ${string}`)
	}else if(level.toLowerCase() == 'warn'){
		console.log(`${chalk.yellow(`[WARN: ${time}]`)} - ${string}`)
	}else if(level.toLowerCase() == 'music'){
		console.log(`${chalk.blue(`[MUSIC: ${time}]`)} - ${string}`)
	}else{
		console.log(string)
	}
}
client.commands = new Collection();
client.youtube = youtube;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
log(`info`, `Loaded all the command files!`)
client.log=log
client.music = new Collection();
client.once('ready',() => log(`info`,`Logged in as ${client.user.tag}`))
client.on('message', async msg => {
	if(msg.author.bot || !msg.content.toLowerCase().startsWith(config.prefix) || !msg.guild) return;
  const args = msg.content.slice(config.prefix.length).trim().split(' ');
  const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if(!command) return
	if (command.args && !args.length) {
		return msg.channel.send(`You didn't provide any arguments, the format for this command is \`${command.format}\``)
	}
	for(const permission of command.permissions){
		if(!msg.member.permissions.has(permission)){
			const needsPermissionEmbed = new MessageEmbed()
				.setColor("RED")
				.setTitle("Invalid Permissions!")
				.setDescription("You don't have permission to do this!")
				.addField("Required permissions", command.permissions.join(", "))
			msg.channel.send(needsPermissionEmbed)
			return;
		}
	}
	for(const permission of command.myPermissions){
		if(!msg.guild.me.permissions.has(permission)){
			const needsPermissionEmbed = new MessageEmbed()
				.setColor("RED")
				.setTitle("Invalid Permissions!")
				.setDescription("I don't have permission to do this!")
				.addField("Required permissions", command.permissions.join(", "))
			msg.channel.send(needsPermissionEmbed)
			return;
		}
	}
	try{
		command.run(msg, args, client)
	}catch(e){
		log('error', e)
		return;
	}
})
client.on('warn', m => log('warn', m));
client.on('error', m => log('error', m));

process.on('uncaughtException', error => log('error', error));
client.login(config.token)