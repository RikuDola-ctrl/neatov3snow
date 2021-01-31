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
		desc: {
            type: DataTypes.STRING,
            unique: true,
        },
		cost: {
			type: DataTypes.INTEGER,
			allowNull: false,
        },
	}, {
		timestamps: false,
	});
};