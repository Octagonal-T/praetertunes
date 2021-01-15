const {MessageEmbed} = require('discord.js')
const lyrics = require('lyrics-finder')
const CarouselEmbed = require('../carouselEmbed')
module.exports={
	name: 'lyrics',
	aliases: [],
	permissions: [],
	myPermissions: [],
	format: 'lyrics <song>',
	description: 'Gets the lyrics of a song',
	args: true,
	async run(msg, args, client){
		let message = await msg.channel.send("Searching...");
		const songLyrics = await lyrics('',args.join(" ")).catch((e) => {
			client.log('warn', e)
			msg.channel.send("Something went wrong!")
		})
		if(!songLyrics) return message.edit("Nothing found!")
		if(songLyrics.length>2048){
			const split = songLyrics.split("\n")
			const embeds =[]
			let tempText=""
			for(i=0;i<split.length;i++){
				splitText=split[i]
				const beforeText = tempText
				tempText+=splitText+"\n";
				if(tempText.length>2048||i==split.length-1){
					embeds.push(new MessageEmbed().setDescription(beforeText).setFooter("Still in beta, may not be accurate").setColor("GREEN"))
					tempText=""
				}
			}
			message.delete()
			new CarouselEmbed(embeds,msg).startCarousel();
		}else{
			const foundEmbed = new MessageEmbed()
				.setDescription(songLyrics)
				.setColor("GREEN")
				.setFooter("Still in beta, may not be accurate")
			message.edit("",foundEmbed)
		}
	}
}