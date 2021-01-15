module.exports={
	name: 'leave',
	aliases: ['disconnect'],
	permissions: [],
	myPermissions: [],
	description: 'Leaves the voice channel you are currently in',
	format: 'leave',
	args: false,
	async run(msg, args, client){
		let guild = await client.music.get(msg.guild.id)
		if(!guild && !msg.guild.me.voice.channel) {
			msg.channel.send("This server is not connected!")
			return
		}
		if(!msg.member.permissions.has("ADMINISTRATOR")){
			if(msg.member.voice.channel.id != msg.guild.me.voice.channel.id){
				msg.channel.send("You're not in the same VC as me!")
				return
			}
		}
		msg.guild.me.voice.channel.leave()
		client.music.delete(msg.guild.id)
		msg.channel.send("Disconnected!")
	}	
}