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
	/* CurrencyShop.upsert({ emoji: ``, name: ``, desc: ``, alias: ``, cost: 0 }) */
	CurrencyShop.upsert({ emoji: `🛍️`,name: `Trusted Buyer Badge`, desc: `This item will show in your balance so that others know you're a trusted buyer`, alias: `trusted buyer`, cost: 2500 }),
	CurrencyShop.upsert({ emoji: `📦`,name: `Trusted Seller Badge`, desc: `This item will show in your balance so that others know you're a trusted seller`, alias: `trusted seller`, cost: 2500 }),
	];
	await Promise.all(shop);
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);