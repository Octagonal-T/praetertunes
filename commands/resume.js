module.exports={
	name: 'resume',
	aliases: [],
	permissions: [],
	myPermissions: [],
	args: false,
	format: 'resume',
	description: 'Resumes the song',
	async run(msg, args, client){
		let serverInfo = client.music.get(msg.guild.id)
		if(!serverInfo) return msg.channel.send("This server is not connected!")
		if(!serverInfo.paused) return msg.channel.send("This server is already playing!")
		serverInfo.dispatcher.resume()
		serverInfo.paused = false
		client.music.set(msg.guild.id, serverInfo)
		msg.channel.send("Resumed!")
	}
}