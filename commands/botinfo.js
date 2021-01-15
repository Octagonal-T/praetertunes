const os = require('os')
const cpuStat = require('cpu-stat')
const {MessageEmbed} = require('discord.js')
const formatBytes =(a, b) =>{
  if (0 == a) return "0 Bytes";
  let c = 1024,
	d = b || 2,
	e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
	f = Math.floor(Math.log(a) / Math.log(c));
  
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}
const parseDur = (ms) => {
  let seconds = ms / 1000,
		days = parseInt(seconds / 86400);
  seconds = seconds % 86400
  
  let hours = parseInt(seconds / 3600);
  seconds = seconds % 3600
  
  let minutes = parseInt(seconds / 60);
  seconds = parseInt(seconds % 60)
  
  if (days) {
    return `${days} day, ${hours} hours, ${minutes} minutes`
  } else if (hours) {
    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`
  } else if (minutes) {
    return `${minutes} minutes, ${seconds} seconds`
  }
  return `${seconds} second(s)`
}
module.exports={
	name: 'botinfo',
	aliases: [],
	permissions: [],
	myPermissions: [],
	args: false,
	format: 'botinfo',
	description: 'Gets information about the bot',
	async run(msg, args, client){
  	cpuStat.usagePercent(function (error, percent, seconds) {
			if (error) {
				return client.log('error', error)
			}
			
			const cores = os.cpus().length
			const cpuModel = os.cpus()[0].model
			const guild = client.guilds.cache.size.toLocaleString()
			const user = client.users.cache.size.toLocaleString()
			const channel = client.channels.cache.size.toLocaleString()
			const usage = formatBytes(process.memoryUsage().heapUsed)
			const Node = process.version
			const CPU = percent.toFixed(2)
			
			const embed = new MessageEmbed()
			embed.addField('Bot Statistics:', `Servers: **${guild}** \nUser: **${user}** \nChannel: **${channel}** \nStorage use: **${usage}** \nNode version: **${Node}** \nCPU Usage: **${CPU}%**`)
			embed.addField('Physical Statistics:', `CPU: **${cores}** - **${cpuModel}** \nUptime: **${parseDur(client.uptime)}**`)
			embed.setColor("RED")
			msg.channel.send(embed)
	 })
	}
}