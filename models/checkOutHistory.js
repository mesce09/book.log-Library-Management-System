module.exports = (sequelize, DataTypes) => {
	var CheckOutHistory = sequelize.define(
		"CheckOutHistory",
		{
			isCheckedOut: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true
			},

			lateFees: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0
			},

			createdAt: {
				type: DataTypes.DATE,
				field: "dateCheckedOut",
				defaultValue: sequelize.literal("NOW()")
			},

			updatedAt: {
				type: DataTypes.DATE,
				field: "dateCheckedIn",
				allowNull: true
			}
		},

		{
			timestamps: false
		}
	);

	CheckOutHistory.associate = models => {
		CheckOutHistory.belongsTo(models.Medium, {
			foreignKey: {
				allowNull: false
			}
		});

		CheckOutHistory.belongsTo(models.User, {
			foreignKey: {
				allowNull: false
			}
		});
	};

	return CheckOutHistory;
};
