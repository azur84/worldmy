const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config()

const sequelize = new Sequelize(process.env.DataBaseURI)

async function auth() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}
auth()

const Place = sequelize.define(
    "Place",
    {
        guildid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING
        },
        icon: {
            type: DataTypes.STRING
        }
    }
)

const PlaceItemEntry = sequelize.define(
    "PlaceItemEntry",
    {
        guildid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        placeid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        itemid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        pourcentage: {
            type: DataTypes.NUMBER,
            defaultValue: 100
        }
    }
)

const InventoryEntry = sequelize.define(
    "InventoryEntry",
    {
        guildid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        itemid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    }
)
const BuildingArea = sequelize.define(
    "BuildingArea",
    {
        guildid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type:{
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity:{
            type: DataTypes.INTEGER,
            defaultValue:0
        }
    }
)

module.exports = {
    sequelize
}