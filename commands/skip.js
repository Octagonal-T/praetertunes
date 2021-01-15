const play = require('../play')
module.exports={
	name: 'skip',
	format: 'skip',
	args: false,
	description: 'Skips the current song to the next one in the queue',
	aliases: [],
	permissions: [],
	myPermissions: [],
	async run(msg, args, client){
		let serverInfo = client.music.get(msg.guild.id)
		if(!serverInfo) return msg.channel.send("This server is not connected!")
		if(!serverInfo.queue.length) return msg.channel.send("There's nothing in the queue!")
		serverInfo.dispatcher.destroy()
		play(msg, msg.guild, client)
	}
}