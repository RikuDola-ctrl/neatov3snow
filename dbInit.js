const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const CurrencyShop = require('./models/CurrencyShop')(sequelize, Sequelize.DataTypes);
require('./models/Users')(sequelize, Sequelize.DataTypes);
require('./models/UserItems')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [
		/* CurrencyShop.upsert({ emoji: ``, name: ``, desc: ``, alias: ``, cost: 0, role: ``, roleReq: `` }) */
		CurrencyShop.upsert({ emoji: `🛍️`, name: `\`Buyer Badge\``, alias: `buyer badge`, cost: 1500, role: `806185184563167239`, roleReq: `749398291849936947` }),
		CurrencyShop.upsert({ emoji: `📦`, name: `\`Seller Badge\``, alias: `seller badge`, cost: 1500, role: `806185323309826058`, roleReq: `749398291849936947` }),
		CurrencyShop.upsert({ emoji: `🧊`, name: `\`Fridge\``, alias: `fridge`, cost: 2500, role: `737452571546877982`, roleReq: `749398291849936947` }),
		CurrencyShop.upsert({ emoji: `♙`, name: `<@&749398291849936947>`, alias: `pawn`, cost: 2500, role: `749398291849936947`, roleReq: `737452571546877982` }),
		CurrencyShop.upsert({ emoji: `♖`, name: `<@&737452903911915560>`, alias: `rook`, cost: 10000, role: `737452903911915560`, roleReq: `749398291849936947` }),
		CurrencyShop.upsert({ emoji: `♘`, name: `<@&737452963718758421>`, alias: `knight`, cost: 15000, role: `737452963718758421`, roleReq: `737452903911915560` }),
		CurrencyShop.upsert({ emoji: `♗`, name: `<@&737453003321114644>`, alias: `bishop`, cost: 20000, role: `737453003321114644`, roleReq: `737452963718758421` }),
		CurrencyShop.upsert({ emoji: `👑`, name: `<@&751872174079344730>`, alias: `checkmate`, cost: 25000, role: `751872174079344730`, roleReq: `737453003321114644` }),
		CurrencyShop.upsert({ emoji: `♣️`, name: `<@&737454098390974504>`, alias: `clubs`, cost: 30000, role: `737454098390974504`, roleReq: `751872174079344730` }),
		CurrencyShop.upsert({ emoji: `♦️`, name: `<@&737454220910788731>`, alias: `diamonds`, cost: 35000, role: `737454220910788731`, roleReq: `737454098390974504` }),
		CurrencyShop.upsert({ emoji: `♥️`, name: `<@&737454253827948635>`, alias: `hearts`, cost: 40000, role: `737454253827948635`, roleReq: `737454220910788731` }),
		CurrencyShop.upsert({ emoji: `♠️`, name: `<@&737454298149027930>`, alias: `spades`, cost: 45000, role: `737454298149027930`, roleReq: `737454253827948635` }),
		CurrencyShop.upsert({ emoji: `🂡`, name: `<@&753111002454949989>`, alias: `ace of spades`, cost: 50000, role: `753111002454949989`, roleReq: `737454298149027930` }),
		CurrencyShop.upsert({ emoji: `💸`, name: `<@&753113683080642661>`, alias: `royal flush`, cost: 55000, role: `753113683080642661`, roleReq: `753111002454949989` }),
	];
	await Promise.all(shop);
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);