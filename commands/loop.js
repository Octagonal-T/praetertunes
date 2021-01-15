module.exports={
	name: 'loop',
	aliases: ['loopqueue'],
	permissions: [],
	myPermissions: [],
	description: 'Loops the queue',
	format: 'loop',
	args: false,
	async run(msg, args, client){
		const serverInfo = client.music.get(msg.guild.id)
		if(!serverInfo) return msg.channel.send("This server is not connected!")
		if(!serverInfo.np) return msg.channel.send("There is nothing currently playing!")
		if(serverInfo.loop){
			serverInfo.loop=false
			msg.channel.send("Disabled loop!")
			serverInfo.queue.pop()
		}else{
			serverInfo.loop=true
			msg.channel.send("Enabled loop!")
			serverInfo.queue.push(serverInfo.np)
		}
		client.music.set(msg.guild.id,serverInfo)
	}
}