module.exports={
	name: 'join',
	aliases: ['connect'],
	permissions: [],
	myPermissions: ["CONNECT"],
	description: 'Joins the voice channel you are currently in',
	format: 'join',
	args: false,
	async run(msg, args, client){
		let guild = await client.music.get(msg.guild.id)
		if(!guild){
			let channel = msg.member.voice.channel
			if(!channel) {
				msg.channel.send("You need to be connected to a voice channel first!")
				return
			}
			let connection = await channel.join().catch((e) => {
				msg.channel.send("There was an error joining the channel!")
				client.log("error", e)
				return;
			})
			msg.channel.send(`Joined **${channel.name}**`)
			client.music.set(msg.guild.id, {connection: connection, dispatcher: null, queue: [], np: null,paused: false,loop:false})
		}else{
			msg.channel.send("This guild is already connected!")
		}
	}
}