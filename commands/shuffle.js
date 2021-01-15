const shuffle=(array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (0!==currentIndex){
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
module.exports={
	name: 'shuffle',
	format: 'shuffle',
	description: 'Shuffles the queue',
	args: false,
	aliases: [],
	permissions: [],
	myPermissions: [],
	async run(msg, args, client){
		const serverInfo = client.music.get(msg.guild.id)
		if(!serverInfo) return msg.channel.send("This server is not connected!")
		if(!serverInfo.queue.length) return msg.channel.send("There is nothing in the queue!")
		let shuffledQueue = shuffle(serverInfo.queue)
		serverInfo.queue=shuffledQueue
		msg.channel.send("Shuffled the queue!")
		client.music.set(msg.guild.id,serverInfo)
	}
}