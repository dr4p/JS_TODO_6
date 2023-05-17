const Sequelize = require("sequelize");
const { SequelizeInst } = require("..");
const User = require("./user.model");

class Token extends Sequelize.Model {}

Token.init(
    {
        value: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        userId: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,

        }
    },

    { sequelize: SequelizeInst, underscored: true, modelName: "token" }
);



module.exports = Token;