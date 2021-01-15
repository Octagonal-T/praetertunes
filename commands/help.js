const {MessageEmbed} = require('discord.js');
const CarouselEmbed = require('../carouselEmbed')
module.exports = {
	name: "help",
	format: "help [commandName]",
	description: 'Get help within commands',
	permissions: [],
	myPermissions: [],
	aliases: [],
	args: false,
	async run(msg, args, client){
		if(args.length){
			const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
			if(!command || !commandBoolean.commands[command.name] || command.hideFromHelp) {
				msg.channel.send("Sorry, that command doesnt exist")
				return
			}
			const helpEmbed = new MessageEmbed()
				.setColor("BLUE")
				.setTitle("Help menu")
				.addField(command.name, command.description, false)
				.addField("Format", `\`\`\`${command.format}\`\`\``, false)
				.addField("Aliases", command.aliases.length ? "`" + command.aliases.join("`\n`") + "`" : "None")
			msg.channel.send(helpEmbed)
		}else{
			let commands = client.commands.filter(c =>!c.hideFromHelp)
			let commandsMapped = commands.map(c => "`" + c.name + "`  " + c.description).join('\n')
			let embeds =[];
			if(commandsMapped.length <= 1024){
				const helpEmbed = new MessageEmbed()
					.setColor("RED")
					.setTitle("Help Menu")
					.addField("Commands", commandsMapped, true);
				embeds.push(helpEmbed)
			}else{
				let commandsArray=[]
				commands.forEach(c => {
					commandsArray.push("`" + c.name + "`  " + c.description)
				})
				do{
					let tempArray=[]
					for(i=0;i<20;i++){
						tempArray.push(commandsArray[0])
						commandsArray.shift()
					}
					const tempEmbed = new MessageEmbed()
						.setTitle("Help menu!")
						.addField('Comands', tempArray.join("\n"))
						.setColor("RED")
					embeds.push(tempEmbed)
				}while(commandsArray.length !== 0)
			}
			const helpCarousel = new CarouselEmbed(embeds, msg)
			helpCarousel.startCarousel()
		}
	}
}