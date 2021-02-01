const Discord = require('discord.js');
const client = new Discord.Client();
const { Users, CurrencyShop } = require('./dbObjects');
const { Op } = require('sequelize');
const currency = new Discord.Collection();
const PREFIX = 'n!' && 'n';
const cooldowns = new Discord.Collection();
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
});

client.on('message', async message => {
	if (message.author.bot) return;
	currency.add(message.author.id, 2);
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
			.setThumbnail(target.displayAvatarURL({ format: "png", dynamic: true }))
			.setColor(`6993ff`)
			.setDescription(`Showing <@${target.id}>'s balance**›**\n\n**‹❄️ ${currency.getBalance(target.id)}** · \`Snowflake\`**›**\n${items.map(i => `**‹**${i.item.emoji} **${i.amount}** · \`${i.item.name}\`**›**`).join('\n')}`)
			.setImage(``)
			.setFooter('❄️ ❄️ ❄️ ❄️ ❄️');
		return message.channel.send(embed)
	} else if (command === 'buy') {
		/* return message.channel.send(`Sorry ${message.author}, this command is temporarily unavailable until further notice`); */
		const item = await CurrencyShop.findOne({ where: { alias: { [Op.like]: commandArgs } } });
		if (!item) return message.channel.send(`That item is invalid, please check your spelling and try again`);
		if (item.cost > currency.getBalance(message.author.id)) {
			const noFundsEmbed = new Discord.MessageEmbed()
				.setColor(`6993ff`)
				.setDescription(`You currently have **‹❄️ ${currency.getBalance(message.author.id)}** · \`Snowflake\`**›**,\nbut the **‹${item.emoji}** · \`${item.name}\`**›** costs **‹❄️ ${item.cost}** · \`Snowflake\`**›**`)
				.setFooter('❄️ ❄️ ❄️ ❄️ ❄️')
				.setTitle(`Insufficient Funds`)
				.setThumbnail(message.author.displayAvatarURL({ format: "png", dynamic: true }));
			return message.channel.send(noFundsEmbed);
		}

		const user = await Users.findOne({ where: { user_id: message.author.id } });
		currency.add(message.author.id, -item.cost);
		await user.addItem(item);
		const buyEmbed = new Discord.MessageEmbed()
			.setColor(`6993ff`)
			.setTitle(`Purchase Successful`)
			.setThumbnail(message.author.displayAvatarURL({ format: "png", dynamic: true }))
			.setFooter('❄️ ❄️ ❄️ ❄️ ❄️')
			.setDescription(`Bought **‹**${item.emoji} · \`${item.name}\`**›** for **‹❄️ ${item.cost}** · \`Snowflake\`**›**`);
		message.channel.send(buyEmbed);
	} else if (command === 'give') {
		const currentAmount = currency.getBalance(message.author.id);
		const transferAmount = commandArgs.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
		const transferTarget = message.mentions.users.first();
		if (transferTarget.bot) return message.channel.send(`You must mention another **user** to use this command`)
		if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`You don't seem to know how to use this command`);
		if (transferAmount > currentAmount) return message.channel.send(`You only have **‹❄️ ${currentAmount}** · \`Snowflake\`**›**`);
		if (transferAmount <= 0) return message.channel.send(`Please enter an amount **greater than zero**`);

		currency.add(message.author.id, -transferAmount);
		currency.add(transferTarget.id, transferAmount);
		const transferEmbed = new Discord.MessageEmbed()
			.setTitle(`Transfer Successful`)
			.setDescription(`${message.author} → ${transferTarget}\n**‹❄️ ${transferAmount}** · \`Snowflake\`**›**`)
			.setColor(`6993ff`)
			.setFooter('❄️ ❄️ ❄️ ❄️ ❄️')
			.setThumbnail(transferTarget.displayAvatarURL({ format: "png", dynamic: true }));
		return message.channel.send(transferEmbed);
	} else if (command === 'shop') {
		const items = await CurrencyShop.findAll();
		const shopEmbed = new Discord.MessageEmbed()
			.setColor('6993ff')
			.setTitle('Shop')
			.setFooter('❄️ ❄️ ❄️ ❄️ ❄️')
			.setDescription(items.map(item => `**‹${item.emoji} 1** · \`${item.name}\`**›**\n*${item.desc}*\n\`\`\`diff\n- ‹❄️ ${item.cost} · \`Snowflake\`›\n* ‹ n!buy ${item.alias} ›\`\`\``).join('\n'), { code: false });
		message.channel.send(shopEmbed);
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
			.setColor("6993ff")
			.setTitle("Reward Claimed")
			.setFooter('❄️ ❄️ ❄️ ❄️ ❄️')
			.setThumbnail(message.author.displayAvatarURL({ format: "png", dynamic: true }))
			.setDescription(`<@${message.author.id}> has earned:\n**‹❄️ 250** · \`Snowflake\`**›**\n\nYou may reuse this command every \`24 hours\``)
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
			.setColor("6993ff")
			.setTitle("User Bumped")
			.setFooter('❄️ ❄️ ❄️ ❄️ ❄️')
			.setThumbnail(target.displayAvatarURL({ format: "png", dynamic: true }))
			.setDescription(`Both ${target} & <@${message.author.id}> have earned:\n**‹❄️ 100** · \`Snowflake\`**›**\n\nYou may reuse this command every \`60 minutes\``)
		return message.channel.send(repEmbed);
	} else if (command === 'help') {
		const helpEmbed = new Discord.MessageEmbed()
			.setColor(`6993ff`)
			.setTitle(`Neato™ Help Page`)
			.setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))
			.setFooter('❄️ ❄️ ❄️ ❄️ ❄️')
			.setURL(`https://discord.com/invite/HVUGfKS`)
			.setDescription(`**Neato™** is a Discord Bot made by \`Riku#5475\`\nIt's used as a **crosstrade** bot, with **‹❄️** · \`Snowflake\`**›** as currency\n**Commands include:**`)
			.addField(`\`n!help\``, `*Shows this page*`)
			.addField(`\`n!bal\``, `*Shows balance & items*`)
			.addField(`\`n!top\``, `*Shows the **‹❄️ ** · \`Snowflake\`**›** leaderboard*`)
			.addField(`\`n!give\``, `*Gives mentioned user **‹❄️ x** · \`Snowflake\`**›***`)
			.addField(`\`n!bump\``, `*Gives you & mentioned user **‹❄️ 100** · \`Snowflake\`**›***`)
			.addField(`\`n!daily\``, `*Redeem your daily reward of **‹❄️ 250** · \`Snowflake\`**›***`)
			.addField(`\`n!shop\``, `*Shows the shop*`);
		return message.channel.send(helpEmbed);
	} else if (command === 'top') {
		currency.set(client.user.id, 0)
		const lbEmbed = new Discord.MessageEmbed()
			.setTitle(`❄️ Snowflake Leaderboard ❄️`)
			.setColor('6993ff')
			.setFooter('❄️ ❄️ ❄️ ❄️ ❄️')
			.setDescription(currency.sort((a, b) => b.balance - a.balance)
				.filter(user => client.users.cache.has(user.user_id))
				.first(5)
				.map((user, position) => `**\`[${position + 1}]\`** <@${(client.users.cache.get(user.user_id).id)}>\n**‹**❄️ **${user.balance}** · \`Snowflake\`**›**`)
				.join('\`\`\` \`\`\`'),
				{ code: false });
		return message.channel.send(lbEmbed);
	} 
});

client.login(process.env.BOT_TOKEN);
// client.login('NzQ1NDcwNTkyMTE5MjA5OTk0.XzyPlw.2283P6YPwYmnnYWwLMR65jO69mk');