const Discord = require('discord.js');
const client = new Discord.Client();
const { Users, CurrencyShop } = require('./dbObjects');
const { Op } = require('sequelize');
//const { format } = require('sequelize/types/lib/utils');
const Canvas = require('canvas');
const currency = new Discord.Collection();
const PREFIX = 'n!' && 'n';
const cooldowns = new Discord.Collection();
const color = `9B2F2E`;
const pasta = require('./pasta.json');
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
Reflect.defineProperty(currency, 'add', {
	/* eslint-disable-next-line func-name-matching */
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});
Reflect.defineProperty(currency, 'getBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

client.once('ready', async () => {
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setStatus("idle");
	console.log(`Logged in at ${client.readyAt}`);
});

const collectedCooldown = new Set();
let x = 0;
let x2 = 0;
setInterval(checkDate, 1);
function checkDate() {
	const today = new Date();
	const hour = today.getHours();
	const minute = today.getMinutes();
	const second = today.getSeconds();
	var time = (hour + "," + minute + "," + second);
	const midnight = (time === "0,0,0");
	if (midnight) {
		x2 = 0;
	}
}
client.on('message', async message => {
	const today = new Date();
	const dotw = today.getDay();
	const wknd = (dotw === 0 || dotw === 5 || dotw === 6);
	if (message.channel.id === "736210787525460079") {
		if (message.content.toLowerCase().includes("is dropping")) {
			const filter = (reaction, user) => {
				return reaction.emoji.name === '❄️' && user.id != msg.author.id && user.id != "605938419813842944";
			};
			const collector = msg.createReactionCollector(filter, { max: 3, time: 7500 });
			msg.react('☁️')
				.then(() => msg.react('🌨️'))
				.then(() => msg.react('❄️'));
			collector.on('collect', (reaction, user) => {
				if (!collectedCooldown.has(user.id)) {
					const collectedSnow = getRandomInt(100, 175);
					currency.add(user.id, collectedSnow);
					client.channels.cache.get('736210787525460079').send(`${user} has collected **‹❄️ ${collectedSnow} · \`Snowflakes\`›**`);
					collectedCooldown.add(user.id);
					setTimeout(() => {
						collectedCooldown.delete(user.id)
					}, 600000);
				} else {
					return client.channels.cache.get('736210787525460079').send(`${user}, you're on a cooldown!`);
				}
			})
			collector.on('end', collected => {
				const meltedEmbed = new Discord.MessageEmbed()
					.setColor('ff7d00')
					.setTitle('🌤️ Looks like all the snow has melted... 🌤️')
					.setImage('https://media1.tenor.com/images/0354595139f78447ca9f6265c02681d7/tenor.gif?itemid=19265255')
					.setDescription('Don\'t worry, it\'ll snow again soon, so just stay active!');
				msg.edit('', meltedEmbed)
					.then(() => msg.reactions.removeAll());
			});
		}
		if (message.content.toLowerCase().includes("i'm dropping")) {
			const filter = (reaction, user) => {
				return reaction.emoji.name === '4️⃣' && user.id === message.author.id;
			};
			const collector = msg.createReactionCollector(filter, { max: 1, time: 5000 });
			collector.on('collect', (reaction) => {
				message.react('✨');
				message.channel.send('Make sure to react with ✨ if the drop is swag <:gbPoggies:808694497822638090>');
			})
			collector.on('end', collected => {
				message.react('✨');
				message.channel.send('Make sure to react with ✨ if the drop is swag <:gbPoggies:808694497822638090>');
			});
		}
		
		x2++;
	}
	if (message.author.bot) return;
	if (!message.guild) return;
	 if (message.channel.id != '738033863779156009') return;
	if (wknd) {
		currency.add(message.author.id, 1.5);
	} else {
		currency.add(message.author.id, 1);
	}
	x++;
	console.log(x);
	if (x % 250 === 0) {
		console.log('Snowing 🌨️');
		if (wknd) {
			const snowingEmbed = new Discord.MessageEmbed()
				.setColor(color)
				.setTitle('🌨 It\'s Snowing! 🌨')
				.setImage('https://media1.tenor.com/images/490e433082a04c1d32c542b76d91e9e1/tenor.gif?itemid=19502259')
				.setDescription('**React** with ❄️ to collect some **‹❄️ · \`Snowflakes\`›**\n**It\'s the weekend: EXTRA ‹❄️ · \`Snowflakes\`›**');
			const msg = await client.channels.cache.get('736210787525460079').send(snowingEmbed);
			const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(userId));
			const filter = (reaction, user) => {
				return reaction.emoji.name === '❄️' && user.id != msg.author.id && user.id != "605938419813842944";
			};
			const collector = msg.createReactionCollector(filter, { max: 3, time: 7500 });
			msg.react('☁️')
				.then(() => msg.react('🌨️'))
				.then(() => msg.react('❄️'));
			collector.on('collect', (reaction, user) => {
				if (!collectedCooldown.has(user.id)) {
					const collectedSnow = getRandomInt(100, 175);
					currency.add(user.id, collectedSnow);
					client.channels.cache.get('736210787525460079').send(`${user} has collected **‹❄️ ${collectedSnow} · \`Snowflakes\`›**`);
					collectedCooldown.add(user.id);
					setTimeout(() => {
						collectedCooldown.delete(user.id)
					}, 600000);
				} else {
					return client.channels.cache.get('736210787525460079').send(`${user}, you're on a cooldown!`);
				}
			})
			collector.on('end', collected => {
				const meltedEmbed = new Discord.MessageEmbed()
					.setColor('ff7d00')
					.setTitle('🌤️ Looks like all the snow has melted... 🌤️')
					.setImage('https://media1.tenor.com/images/0354595139f78447ca9f6265c02681d7/tenor.gif?itemid=19265255')
					.setDescription('Don\'t worry, it\'ll snow again soon, so just stay active!');
				msg.edit('', meltedEmbed)
					.then(() => msg.reactions.removeAll());
			});
		} else {
			const snowingEmbed = new Discord.MessageEmbed()
				.setColor(color)
				.setTitle('🌨 It\'s Snowing! 🌨')
				.setImage('https://media1.tenor.com/images/490e433082a04c1d32c542b76d91e9e1/tenor.gif?itemid=19502259')
				.setDescription('**React** with ❄️ to collect some **‹❄️ · \`Snowflakes\`›**');
			const msg = await client.channels.cache.get('736210787525460079').send(snowingEmbed);
			const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(userId));
			const filter = (reaction, user) => {
				return reaction.emoji.name === '❄️' && user.id != msg.author.id;
			};
			const collector = msg.createReactionCollector(filter, { max: 1, time: 15000 });
			msg.react('☁️')
				.then(() => msg.react('🌨️'))
				.then(() => msg.react('❄️'));
			collector.on('collect', (reaction, user) => {
				if (!collectedCooldown.has(user.id)) {
					const collectedSnow = getRandomInt(100, 175);
					currency.add(user.id, collectedSnow);
					client.channels.cache.get('736210787525460079').send(`${user} has collected **‹❄️ ${collectedSnow} · \`Snowflakes\`›**`);
					collectedCooldown.add(user.id);
					setTimeout(() => {
						collectedCooldown.delete(user.id)
					}, 600000);
				} else {
					return client.channels.cache.get('736210787525460079').send(`${user}, you're on a cooldown!`);
				}
			})
			collector.on('end', collected => {
				const meltedEmbed = new Discord.MessageEmbed()
					.setColor('ff7d00')
					.setTitle('🌤️ Looks like all the snow has melted... 🌤️')
					.setImage('https://media1.tenor.com/images/0354595139f78447ca9f6265c02681d7/tenor.gif?itemid=19265255')
					.setDescription('Don\'t worry, it\'ll snow again soon, so just stay active!');
				msg.edit('', meltedEmbed)
					.then(() => msg.reactions.removeAll());
			});
		}
	};
	if (!message.content.toLowerCase().startsWith(PREFIX)) return;
	const input = message.content.slice(PREFIX.length).trim();
	if (!input.length) return;
	const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);
	if (command === 'bal') {
		const target = message.mentions.users.first() || message.author;
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();
		const embed = new Discord.MessageEmbed()
			.setTitle(`Balance`)
			.setThumbnail(`${target.displayAvatarURL({ format: "png", dynamic: true })}?size=1024`)
			.setColor(color)
			.setDescription(`Showing <@${target.id}>'s balance\n\n**‹❄️ ${currency.getBalance(target.id)} · \`Snowflake\`›**\n${items.map((i, position) => `**‹${i.item.emoji} · ${i.item.name}›**`).join('\n')}`)
			.setImage(``);
		return message.channel.send(embed);
	} else if (command === 'buy') {
		const item = await CurrencyShop.findOne({ where: { alias: { [Op.like]: commandArgs } } });
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		if (!item) return message.channel.send(`That item is invalid, please check your spelling and try again`);
		if (item.cost > currency.getBalance(message.author.id)) {
			const noFundsEmbed = new Discord.MessageEmbed()
				.setColor(color)
				.setDescription(`You currently have **‹❄️ ${currency.getBalance(message.author.id)} · \`Snowflake\`›**,\nbut the **‹${item.emoji} · ${item.name}›** costs **‹❄️ ${item.cost} · \`Snowflake\`›**`)
				.setTitle(`Insufficient Funds`)
				.setThumbnail(`${message.author.displayAvatarURL({ format: "png", dynamic: true })}?size=1024`);
			return message.channel.send(noFundsEmbed);
		}
		if (!message.member.roles.cache.has(item.roleReq)) {
			const noRoleEmbed = new Discord.MessageEmbed()
				.setColor(color)
				.setDescription(`You need the <@&${item.roleReq}> role to purchase **‹${item.emoji} · ${item.name}›**`)
				.setTitle(`Requires Role`)
				.setThumbnail(`${message.author.displayAvatarURL({ format: "png", dynamic: true })}?size=1024`);
			return message.channel.send(noRoleEmbed);
		}
		currency.add(message.author.id, -item.cost);
		message.member.roles.add(item.role)
		await user.addItem(item);
		const buyEmbed = new Discord.MessageEmbed()
			.setColor(color)
			.setTitle(`Purchase Successful`)
			.setThumbnail(`${message.author.displayAvatarURL({ format: "png", dynamic: true })}?size=1024`)
			.setDescription(`Bought **‹${item.emoji} · ${item.name}›** for **‹❄️ ${item.cost} · \`Snowflake\`›**`);
		message.channel.send(buyEmbed);
	} else if (command === 'give') {
		if (!message.member.roles.cache.has("806185184563167239")) {
			const noGiveEmbed = new Discord.MessageEmbed()
				.setColor(color)
				.setDescription(`You need the <@&806185184563167239> role to transfer **‹❄️ · \`Snowflakes\`›** to prevent possible alts`)
				.setTitle(`Requires Role`)
				.setThumbnail(`${message.author.displayAvatarURL({ format: "png", dynamic: true })}?size=1024`);
			return message.channel.send(noGiveEmbed);
		}
		const currentAmount = currency.getBalance(message.author.id);
		const transferAmount = commandArgs.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
		const transferTarget = message.mentions.users.first();
		if (transferTarget.bot) return message.channel.send(`You must mention another **user** to use this command`);
		if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`You don't seem to know how to use this command`);
		if (transferAmount > currentAmount) return message.channel.send(`You only have **‹❄️ ${currentAmount} · \`Snowflake\`›**, and you can't give more than you have, dumbass`);
		if (transferAmount <= 0) return message.channel.send(`Please enter an amount **greater than zero**`);
		const amount = transferAmount * 1;
		if (!Number.isInteger(amount)) {
			return message.channel.send(`Please enter a **FUCKING NORMAL INTEGER**`);
		} else {
			currency.add(message.author.id, -transferAmount);
			currency.add(transferTarget.id, transferAmount);
			const transferEmbed = new Discord.MessageEmbed()
				.setTitle(`Transfer Successful`)
				.setDescription(`${message.author} → ${transferTarget}\n**‹❄️ ${transferAmount} · \`Snowflake\`›**`)
				.setColor(color)
				.setThumbnail(`${transferTarget.displayAvatarURL({ format: "png", dynamic: true })}?size=1024`);
			return message.channel.send(transferEmbed);
		}
	} else if (command === 'shop') {
		const items = await CurrencyShop.findAll();
		const shopEmbed = new Discord.MessageEmbed()
			.setColor(color)
			.setTitle('Shop')
			.setDescription(items.map(item => `**‹${item.emoji} · ${item.name}› – ‹❄️ \`${item.cost}\`›**`).join('\n'), { code: true });
		message.channel.send(shopEmbed); /*
	} else if (command === 'daily') {
		if (!cooldowns.has(command)) {
			cooldowns.set(command, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command);
		const cooldownAmount = (86400) * 1000;

		if (timestamps.has(message.author.id)) {
			// ...
		}
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 3600000;
				return message.channel.send(`Please wait **${timeLeft.toFixed()} hour(s)** before claiming your reward again`);
			}
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		currency.add(message.author.id, 250);
		const dailyEmbed = new Discord.MessageEmbed()
			.setColor(color)
			.setTitle("Reward Claimed")
			.setThumbnail(`${message.author.displayAvatarURL({ format: "png", dynamic: true })}?size=1024`)
			.setDescription(`<@${message.author.id}> has earned:\n**‹❄️ 250 · \`Snowflake\`›**\n\nYou may reuse this command every \`24 hours\``)
		message.channel.send(dailyEmbed);
	} else if (command === 'bump') {
		const target = message.mentions.users.first();
		if (target.bot) return message.channel.send(`You must mention another **user** to use this command`);
		if (!target) return message.channel.send('You must mention another user to use this command');
		if (target === message.author) return message.channel.send('You may have outsmarted me, but I outsmarted your outsmarting!');
		if (!cooldowns.has(command)) {
			cooldowns.set(command, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command);
		const cooldownAmount = (3600) * 1000;

		if (timestamps.has(message.author.id)) {
			// ...
		}
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 60000;
				return message.channel.send(`Please wait **${timeLeft.toFixed()} minute(s)** before bumping to another user`);
			}
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		currency.add(target.id, 100);
		currency.add(message.author.id, 100);
		const repEmbed = new Discord.MessageEmbed()
			.setColor(color)
			.setTitle("User Bumped")
			.setThumbnail(`${target.displayAvatarURL({ format: "png", dynamic: true })}?size=1024`)
			.setDescription(`Both ${target} & <@${message.author.id}> have earned:\n**‹❄️ 100 · \`Snowflake\`›**\n\nYou may reuse this command every \`60 minutes\``)
		return message.channel.send(repEmbed); */
	} else if (command === 'help') {
		const helpEmbed = new Discord.MessageEmbed()
			.setColor(color)
			.setTitle(`Neato™ Help Page`)
			.setThumbnail(`${message.guild.iconURL({ format: "png", dynamic: true })}?size=1024`)
			.setURL(`https://discord.com/invite/HVUGfKS`)
			.setDescription(`**Neato™** is a Discord Bot made by \`Riku#5475\`\nIt's used as a **crosstrade** bot, with **‹❄️ · \`Snowflake\`›** as currency\n**Commands include:**`)
			.addField(`\`n!help\``, `Shows this page`)
			.addField(`\`n!bal\``, `Shows balance & items`)
			.addField(`\`n!top\``, `Shows the **‹❄️ · \`Snowflake\`›** leaderboard`)
			.addField(`\`n!give\``, `Gives mentioned user **‹❄️ x · \`Snowflake\`›**`)
			.addField(`\`n!bump\``, `Gives you & mentioned user **‹❄️ 100 · \`Snowflake\`›**`)
			.addField(`\`n!daily\``, `Redeem your daily reward of **‹❄️ 250 · \`Snowflake\`›**`)
			.addField(`\`n!shop\``, `Shows the shop`);
		return message.channel.send(helpEmbed);
	} else if (command === 'top') {
		currency.set(client.user.id, 0)
		const lbEmbed = new Discord.MessageEmbed()
			.setTitle(`❄️ Snowflake Leaderboard ❄️`)
			.setColor(color)
			.setDescription(currency.sort((a, b) => b.balance - a.balance)
				.filter(user => client.users.cache.has(user.user_id))
				.first(5)
				.map((user, position) => `**\`[${position + 1}]\`** <@${(client.users.cache.get(user.user_id).id)}>\n**‹❄️ ${user.balance} · \`Snowflake\`›**`)
				.join('\`\`\` \`\`\`'),
				{ code: false });
		return message.channel.send(lbEmbed);
	} else if (command === 'st') {
		let totalSeconds = (client.uptime / 1000);
		let days = Math.floor(totalSeconds / 86400);
		totalSeconds %= 86400;
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.floor(totalSeconds % 60);
		let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
		const statsEmbed = new Discord.MessageEmbed()
			.setAuthor(`Quick Stats`, `${message.guild.iconURL({ format: "png", dynamic: false })}?size=1024`)
			.setColor(color)
			.setThumbnail(`${client.user.displayAvatarURL({ format: "png", dynamic: true })}?size=1024`)
			.setDescription(`**Server Owner**\n**\`${message.guild.owner.user.tag}\`**\n\n**Member Count**\n**\`${message.guild.memberCount}/1,000 Goal\`**\n\n**Uptime**\n**\`${uptime}\`**\n\n**<#736210787525460079> Message Count**\n**\`${x2}/10,000 Daily Goal\`**\n\n**Logged in at**\n**\`${client.readyAt.toString().replace(" (Eastern Standard Time)", "")}\`**\n\n**Ping**\n**\`${Date.now() - message.createdTimestamp}ms/${client.ws.ping}ms\`**`);
		return message.channel.send(statsEmbed);
	} else if (command === "sasuke") {
		const canvas = Canvas.createCanvas(1280, 718);
		const ctx = canvas.getContext('2d');
		const background = await Canvas.loadImage('./itachi.jpeg');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.arc(375, 210, 235, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		const avatar = await Canvas.loadImage(`${message.author.displayAvatarURL({ format: 'png' })}?size=1024`);
		ctx.drawImage(avatar, 125, -40, 500, 500);
		const backgroundTop = await Canvas.loadImage('./sasukechoke2.png');
		ctx.drawImage(backgroundTop, 0, 0, canvas.width, canvas.height);
		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'sasuke.png');
		const sasukeEmbed = new Discord.MessageEmbed()
		.setColor(color)
		.attachFiles([attachment])
		.setImage("attachment://sasuke.png");
		message.channel.send(sasukeEmbed);
	}
});
client.login(pasta.token);