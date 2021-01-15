module.exports={
	name: 'ping',
	format: 'ping',
	description: 'Gets the ping of the bot.',
	permissions: [],
	myPermissions: [],
	args: false,
	aliases: [],
	async run(msg, args, client){
		const pingMessage = await msg.reply("Pinging...")
		pingMessage.edit(`Ping! Round trip took ${pingMessage.createdTimestamp - msg.createdTimestamp}ms.\n API latency: ${client.ws.ping}ms`)
	}
}