module.exports={
	name: 'pause',
	aliases: [],
	permissions: [],
	myPermissions: [],
	args: false,
	format: 'pause',
	description: 'Pauses the current song',
	async run(msg, args, client){
		let serverInfo = client.music.get(msg.guild.id)
		if(!serverInfo) return msg.channel.send("This server is not connected!")
		if(serverInfo.paused) return msg.channel.send("This server is already paused!")
		serverInfo.dispatcher.pause(true)
		serverInfo.paused = true
		client.music.set(msg.guild.id, serverInfo)
		msg.channel.send("Paused!")
	}
}