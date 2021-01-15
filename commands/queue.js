const {MessageEmbed} = require('discord.js')
const {unescapeHTML,convertTime} = require('../functions')
const ytdl = require('ytdl-core')
const CarouselEmbed = require('../carouselEmbed')
module.exports={
	name: 'queue',
	format: 'queue',
	description: 'Returns the queue for the server',
	args: false,
	aliases: [],
	permissions: [],
	myPermissions: [],
	async run(msg, args, client){
		const serverInfo = client.music.get(msg.guild.id)
		if(!serverInfo) return msg.channel.send("This server is not connected!")
		if(!serverInfo.queue.length) return msg.channel.send("There is nothing in the queue!")
		const queue = []
		let i=1;
		let message = await msg.channel.send("Getting songs...")
		for(const video of serverInfo.queue){
			if(video.time){
				queue.push(`${i}. [${unescapeHTML(video.title)}](${video.shortURL}) | ${video.time.hours?video.time.hours+":":""}${video.time.minutes?video.time.minutes+":":"00"}${video.time.seconds?video.time.seconds:"00"}`)
			}else{
				queue.push(`${i}. [${unescapeHTML(video.title)}](${video.shortURL})`)
			}
			i++
		}
		if(queue.join("\n").length <= 2048){
			const embed = new MessageEmbed()
				.setTitle(`${msg.guild.name}'s queue`)
				.setDescription(queue.join("\n"))
				.setColor("BLUE")
				.setFooter(`There are ${queue.length} songs in the queue`)
			msg.channel.send(embed)
		}else{
			const embeds = []
			do{
				let tempArray=[]
				for(i=0;i<20;i++){
					tempArray.push(queue[0])
					queue.shift()
				}
				const tempEmbed = new MessageEmbed()
					.setTitle(`${msg.guild.name}'s queue`)
					.setDescription(tempArray.join("\n"))
					.setColor("BLUE")
					.setFooter(`There are ${serverInfo.queue.length} songs in the queue`)
				embeds.push(tempEmbed)
			}while(queue.length !== 0)
			new CarouselEmbed(embeds, msg).startCarousel()
		}
		message.delete()
	}
}