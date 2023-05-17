const Sequelize = require("sequelize");
const { SequelizeInst } = require("..");
const User = require("./user.model");

class Task extends Sequelize.Model {}

Task.init(
    {
        id: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isCompleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        userId: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
        }
    },

    { sequelize: SequelizeInst, underscored: true, modelName: "todo" }
);

module.exports = Task;