const ytdl = require('ytdl-core')
const {MessageEmbed} = require('discord.js')
const {unescapeHTML} = require('./functions')
const play = async (msg, guild, client)=> {
	let serverInfo = await client.music.get(guild.id)
	let dispatcher = serverInfo.connection.play(ytdl(serverInfo.queue[0].shortURL,{filter: 'audioonly'}),{bitrate: 'auto'})
	const vid = serverInfo.queue[0]
	msg.channel.send(`Now playing **${unescapeHTML(vid.title)}**`)
	serverInfo.dispatcher = dispatcher
	serverInfo.np = serverInfo.queue.shift()
	if(serverInfo.loop){
		serverInfo.queue.push(serverInfo.np)
	}
	dispatcher.on('finish', async () => {
		if(serverInfo.queue.length){
			play(msg, guild, client);
		}else{
			serverInfo.connection.disconnect()
			client.music.delete(guild.id)
			return;
		}
	})
}
module.exports = play