module.exports={
	name: 'stop',
	aliases: [],
	format: 'stop',
	args: false,
	description: 'Stops the current song and destroys queue',
	permissions: [],
	myPermissions: [],
	async run(msg, args, client){
		let guild = await client.music.get(msg.guild.id)
		if(!guild)return msg.channel.send("This server is not connected!")
		if((!msg.member.voice.channel || msg.member.voice.channelID != msg.guild.me.voice.channelID) && (!msg.member.hasPermssion('MANAGE_MESSAGES') || !msg.member.hasPermission('MANAGE_CHANNELS'))) return msg.channel.send("You are not in the same voice chat as me!")
		guild.dispatcher.destroy()
		client.music.set(msg.guild.id, {connection: guild.connection, dispatcher: null, queue: [], np: null,paused: false,loop:false})
		msg.channel.send("Stopped music for this server!")
	}
}