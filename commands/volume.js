module.exports={
	name: 'volume',
	aliases: [],
	permissions: [],
	myPermissions: [],
	args: true,
	description: 'Sets the volume',
	format: 'volume <1-200>',
	async run(msg, args, client){
		const serverInfo = client.music.get(msg.guild.id)
		if(!serverInfo) return msg.channel.send("This server is not connected!")
		if(!serverInfo.np) return msg.channel.send("There is nothing! playing!")
		if(isNaN(args[0])) return msg.channel.send("The volume has to be a number!")
		if(args[0] < 1 || args[0] > 200) return msg.channel.send("The number has to be within 1 and 200!")
		serverInfo.dispatcher.setVolume(args[0]/100)
		msg.channel.send(`Set the volume to **${args[0]}**`)
	}
}