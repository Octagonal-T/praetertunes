const ytdl = require('ytdl-core');
const play = require('../play')
const {MessageEmbed} = require('discord.js')
const {unescapeHTML,convertTime} = require('../functions')
module.exports={
	name: 'play',
	aliases: ['p'],
	permissions: [],
	myPermissions: ["SPEAK", "CONNECT"],
	description: 'Plays a song from youtube',
	format: 'play <video>',
	args: true,
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
			client.music.set(msg.guild.id, {connection: connection, dispatcher: null, queue: [], np: "",paused: false,loop:false})	
		}
		if(!msg.member.voice.channel || msg.member.voice.channel.id != msg.guild.me.voice.channel.id) {
			msg.channel.send("You're not connected to the same channel as me!")
			return
		}
		let flag = false;
		let validate = ytdl.validateURL(args.join(" "))||ytdl.validateID(args.join(" "))
		let stream=[];
		if(validate){//url and id
			stream = [await client.youtube.getVideo(args.join(" "))]
			const info = await ytdl.getInfo(stream[0].shortURL)
			let {hours, minutes, seconds}=convertTime(info.videoDetails.lengthSeconds)
			stream[0]["time"]={hours:hours, minutes:minutes, seconds:seconds,totalSeconds:info.videoDetails.lengthSeconds}
			let addedToQueue = new MessageEmbed()
				.setTitle(unescapeHTML(stream[0].title))
				.setURL(stream[0].shortURL)
				.setColor("GREEN")
				.setThumbnail(stream[0].thumbnails.maxres.url)
				.addField("Song duration",`${hours?hours+":":""}${minutes?minutes+":":"00"}${seconds?seconds:"00"}`)
			if(stream[0].channel.customURL){
				addedToQueue.addField('Channel',`[${unescapeHTML(stream[0].channel.title)}](${unescapeHTML(stream[0].channel.customURL)}`)
			}else{
				addedToQueue.addField('Channel',`[${unescapeHTML(stream[0].channel.title)}](${unescapeHTML(stream[0].channel.url)})`)
			}
			msg.channel.send(`Added **${unescapeHTML(stream[0].title)}** to the queue!`,addedToQueue)
			guild = await client.music.get(msg.guild.id)
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
		}else{ //search video and playlist
			client.youtube.getPlaylist(args.join("")).then(async (tempPlaylist) => {
				//playlist
				flag=true
				stream = await tempPlaylist.getVideos()
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
				guild = await client.music.get(msg.guild.id)
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
			}).catch(async (e) => {
				//video
				tempVideo = await client.youtube.searchVideos(args.join(" "), 1)
				if(!tempVideo[0]) {
					msg.channel.send("Couldn't find a video or playlist with that url or searchword!")
					return;
				}
				stream = [tempVideo[0]]
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
					addedToQueue.addField('Channel',`[${unescapeHTML(stream[0].channel.title)}](${stream[0].channel.customURL}`)
				}else{
					addedToQueue.addField('Channel',`[${unescapeHTML(stream[0].channel.title)}](${unescapeHTML(stream[0].channel.url)})`)
				}
				msg.channel.send(`Added **${unescapeHTML(stream[0].title)}** to the queue!`,addedToQueue)
				guild = await client.music.get(msg.guild.id)
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
			})
		}
	}
}