const {MessageEmbed} = require('discord.js')
module.exports = class carousel{
	constructor(embeds, msg){
		this.embeds = embeds
		this.msg = msg
	}
	async startCarousel(){
		let msg = this.msg
		let page = 0
		let message = await msg.channel.send(this.embeds[page])
		await message.react('◀️')
		await message.react('▶️')
		await message.react('🗑')
		const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀️' && user.id == msg.author.id
		const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶️' && user.id == msg.author.id
		const trashFilter = (reaction, user) => reaction.emoji.name === '🗑' && user.id == msg.author.id
		const backwards = message.createReactionCollector(backwardsFilter, {time: 120000})
		const forwards = message.createReactionCollector(forwardsFilter, {time: 120000})
		const trash = message.createReactionCollector(trashFilter, {time: 120000})
		backwards.on('collect', async r => {
			await r.users.remove(msg.author)
			if(page == 0){
				page = this.embeds.length - 1
			}else{
				page--
			}
			await message.edit(this.embeds[page])
		})
		forwards.on('collect', async r => {
			await r.users.remove(msg.author)
			if(page == this.embeds.length - 1){
				page = 0
			}else{
				page++
			}
			await message.edit(this.embeds[page])
		})
		trash.once('collect', r => {
			message.reactions.removeAll()
		})
		trash.once('end', ()=> {
			message.reactions.removeAll()
		})
	}
}