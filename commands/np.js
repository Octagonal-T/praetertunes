const {MessageEmbed} = require('discord.js')
const {unescapeHTML, convertTime} = require('../functions')
const ytdl = require('ytdl-core')
module.exports={
	name: 'np',
	format: 'np',
	description: 'Gets the song currently playing',
	args: false,
	aliases: ['nowplaying'],
	permissions: [],
	myPermissions: [],
	async run(msg, args, client){
		const serverInfo = client.music.get(msg.guild.id)
		if(!serverInfo) return msg.channel.send("This server is not connected!")
		if(!serverInfo.np) return msg.channel.send("There is nothing currently playing!")

		let dispatcherTime = convertTime(Math.floor(serverInfo.dispatcher.totalStreamTime/1000))
		let index = Math.floor((serverInfo.dispatcher.totalStreamTime/1000)/(serverInfo.np.time.totalSeconds)*20)
		let bar = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬".split("");
		let displayBar;
		if (index >= 1 && index <= 20) {
				bar.splice(index, 0, "🔵")
				displayBar = bar.join("")
		} else {
			displayBar = "🔵▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬"
		}
		msg.channel.send(new MessageEmbed().setTitle(`Now playing`).setThumbnail(serverInfo.np.thumbnails.high.url).setDescription(`[${unescapeHTML(serverInfo.np.title)}](${serverInfo.np.shortURL})\n\n\`${displayBar}\n\n${dispatcherTime.hours?dispatcherTime.hours+":":""}${dispatcherTime.minutes?dispatcherTime.minutes+":":"00:"}${dispatcherTime.seconds?dispatcherTime.seconds:"00"}/${serverInfo.np.time.hours?serverInfo.np.time.hours+":":""}${serverInfo.np.time.minutes?serverInfo.np.time.minutes+":":"00"}${serverInfo.np.time.seconds?serverInfo.np.time.seconds:"00"}\``).setColor("RED"))
	}
}