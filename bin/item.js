const { Model } = require('sequelize')
const { sequelize } = require('./data')

// class ItemBuilder {
//     constructor(guildid, id) {
//         this.data.guildid = guildid
//         this.data.id = id
//     }
//     data = {
//         name: "",
//         id: "",
//         icon: "",
//         guildid: "",
//         producible: false
//     }

//     setIcon(icon) {
//         this.data.icon = icon
//         return this
//     }
//     setName(name) {
//         this.data.name = name
//         return this
//     }
//     setProducible(value) {
//         this.data.producible = value
//         return this
//     }

//     create() {
//         const item = Item.create({
//             guildid: this.data.guildid,
//             id: this.data.id,
//             name: this.data.name,
//             icon: this.data.icon,
//             producible: this.data.producible
//         })
//         return item
//     }
// }

class Item extends Model { 
    toString() {
        return `${this.icon} ${this.name}`
    }
}

Item.init(
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
        },
        producible: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    { sequelize }
)

module.exports = {
    Item
}