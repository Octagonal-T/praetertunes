const ytdl = require('ytdl-core')
const {MessageEmbed}=require('discord.js')
const {unescapeHTML,convertTime} = require('../functions')
const {Channel}=require('simple-youtube-api')
const play = require('../play')
module.exports={
	name:'search',
	format:'search <search word>',
	description:'Searches Youtube for videos and playlists to your key word',
	args:true,
	aliases:[],
	permissions:[],
	myPermissions:[],
	async run(msg,args,client){
		let videoResults = await client.youtube.searchVideos(args.join(" "),5)
		let playlistResults = await client.youtube.searchPlaylists(args.join(" "),5)
		let videoInfo="",
			playlistInfo="",
			i=0;
		for(const videoResult of videoResults){
			videoInfo+=`\`${i+1}\` - [${unescapeHTML(videoResult.title)}](${unescapeHTML(videoResult.shortURL)}) | [${unescapeHTML(videoResult.channel.title)}](${unescapeHTML(videoResult.channel.url)})\n`
			i++
		}
		for(const playlistResult of playlistResults){
			playlistInfo+=`\`${i+1}\` - [${unescapeHTML(playlistResult.title)}](${unescapeHTML(playlistResult.url)}) | [${unescapeHTML(playlistResult.channel.title)}](${unescapeHTML(playlistResult.channel.url)})\n`
			i++
		}
		const embed = new MessageEmbed()
			.setTitle(`Video results for ${args.join(" ")}`)
			.addField('Videos:',videoInfo)
			.addField('Playlists:',playlistInfo)
			.setFooter("React with the number of the object that you want to add to the queue!")
			.setColor("BLUE")
		const message = await msg.channel.send(embed);
		const numbers=["1️⃣",'2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟']
		const filter = (r,u)=>{
			if(u.id==msg.author.id){
				if(numbers.indexOf(r.emoji.name)==-1&&r.emoji.name!=='🗑'){
					return false;
				}else{
					return true;
				}
			}else{
				return false;
			}
		}
		const collector = message.createReactionCollector(filter, {time:120000})
		for(b=0;b<(i);b++){
			await message.react(numbers[b])
		}
		await message.react('🗑')
		collector.on('collect', async (r, u) => {
			switch(r.emoji.name){
				case "🗑":
					message.reactions.removeAll()
					collector.stop()
				break;
				default:
					await r.users.remove(u);
					let serverInfo = await client.music.get(msg.guild.id)
					if(!serverInfo){
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
						client.music.set(msg.guild.id, {connection: connection, dispatcher: null, queue: [], np: "",paused: false,loop:false})	
					}
					if(!msg.member.voice.channel || msg.member.voice.channel.id != msg.guild.me.voice.channel.id) {
						msg.channel.send("You're not connected to the same channel as me!")
						return
					}
					let stream;
					let flag=false;
					const number = numbers.indexOf(r.emoji.name);
					if(number >= 5){ //playlist
						const tempPlaylist = playlistResults[number-5]
						flag=true
						stream=await tempPlaylist.getVideos()
						let addedToQueue = new MessageEmbed()
							.setColor('GREEN')
							.setTitle(unescapeHTML(tempPlaylist.title))
							.setURL(tempPlaylist.url)
							.addField("Total songs",stream.length)
						if(tempPlaylist.channel.customURL){
							addedToQueue.addField('Channel',`[${unescapeHTML(tempPlaylist.channel.title)}](${unescapeHTML(tempPlaylist.channel.customURL)})`)
						}else{
							addedToQueue.addField('Channel',`[${unescapeHTML(stream[0].channel.title)}](${unescapeHTML(stream[0].channel.url)})`)
						}
						msg.channel.send(`Added the songs of **${unescapeHTML(tempPlaylist.title)}** to the queue!`,addedToQueue)
						let guild = await client.music.get(msg.guild.id)
						let needsToBeUpdated = false
						if(!guild.np) needsToBeUpdated = true
						for(const video of stream){
							guild.queue.push(video)
						}
						client.music.set(msg.guild.id, guild)
						if(needsToBeUpdated){
							const info = await ytdl.getInfo(stream[0].shortURL)
							let {hours, minutes, seconds}=convertTime(info.videoDetails.lengthSeconds)
							stream[0]["time"]={hours:hours, minutes:minutes, seconds:seconds,totalSeconds:info.videoDetails.lengthSeconds}
							play(msg, msg.guild, client);
						}
						if(flag){
							for(i=0;i<stream.length;i++){
								const info = await ytdl.getInfo(stream[i].shortURL)
								let {hours, minutes, seconds}=convertTime(info.videoDetails.lengthSeconds)
								stream[i]["time"]={hours:hours, minutes:minutes, seconds:seconds,totalSeconds:info.videoDetails.lengthSeconds}
							}
						}
					}else{ //video
						stream=[videoResults[number]]
						const info = await ytdl.getInfo(stream[0].shortURL)
						let {hours, minutes, seconds}=convertTime(info.videoDetails.lengthSeconds)
						stream[0]["time"]={hours:hours, minutes:minutes, seconds:seconds,totalSeconds:info.videoDetails.lengthSeconds}
						let addedToQueue = new MessageEmbed()
							.setTitle(unescapeHTML(stream[0].title))
							.setURL(stream[0].shortURL)
							.setColor("GREEN")
							.setThumbnail(stream[0].thumbnails.high.url)
							.addField("Song duration",`${hours?hours+":":""}${minutes?minutes+":":"00"}${seconds?seconds:"00"}`)
						if(stream[0].channel.customURL){
							addedToQueue.addField('Channel',`[${unescapeHTML(stream[0].channel.title)}](${unescapeHTML(stream[0].channel.customURL)}`)
						}else{
							addedToQueue.addField('Channel',`[${unescapeHTML(stream[0].channel.title)}](${unescapeHTML(stream[0].channel.url)})`)
						}
						msg.channel.send(`Added **${unescapeHTML(stream[0].title)}** to the queue!`,addedToQueue)
						let guild = await client.music.get(msg.guild.id)
						let needsToBeUpdated = false
						if(!guild.np) needsToBeUpdated = true
						for(const video of stream){
							guild.queue.push(video)
						}
						client.music.set(msg.guild.id, guild)
						if(needsToBeUpdated){
							const info = await ytdl.getInfo(stream[0].shortURL)
							let {hours, minutes, seconds}=convertTime(info.videoDetails.lengthSeconds)
							stream[0]["time"]={hours:hours, minutes:minutes, seconds:seconds,totalSeconds:info.videoDetails.lengthSeconds}
							play(msg, msg.guild, client);
						}
					}

			}
		})
		collector.on('end', () => {
			message.reactions.removeAll();

		})
	}
}