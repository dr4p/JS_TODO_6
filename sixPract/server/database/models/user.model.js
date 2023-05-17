const Sequelize = require("sequelize");
const { SequelizeInst } = require("..");
const Token = require("./token.model");
const Task = require("./todo.model");

class User extends Sequelize.Model {}

User.init(
    {
        id: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },

    { sequelize: SequelizeInst, underscored: true, modelName: "user" }
);

module.exports = User;