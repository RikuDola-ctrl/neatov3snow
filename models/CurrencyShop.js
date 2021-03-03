module.exports = (sequelize, DataTypes) => {
	return sequelize.define('currency_shop', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		alias: {
			type: DataTypes.STRING,
			unique: true,
		},
		emoji: {
			type: DataTypes.STRING,
			unique: false,
		},
		cost: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		role: {
			type: DataTypes.STRING,
			unique: true,
		},
		roleReq: {
			type: DataTypes.STRING,
			unique: false,
		}
	}, {
		timestamps: false,
	});
};