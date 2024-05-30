const { BaseInteraction, EmbedBuilder } = require('discord.js');
const { writeData, getDataList, getData, deleteData } = require('./data');
const { getTranslation } = require('./translation');
const { Inventory } = require('./inventory');

class PlaceBuilder {
    constructor(guildid, id) {
        this.data.guildid = guildid
        this.data.id = id
    }
    data = {
        name: "",
        id: "",
        icon: "",
        guildid: "",
        itemsobtainable: []
    }

    setIcon(icon) {
        this.data.icon = icon
        return this
    }
    setName(name) {
        this.data.name = name
        return this
    }

    create() {
        const item = Place.createWithData(this.data)
        item.save()
        return item
    }
}

class Place {
    itemsobtainable = []
    guildid = ""
    id = ""
    name = ""
    icon = ""
    static Builder = PlaceBuilder

    async save() {
        await writeData(this.guildid, "places", this.id, this)
    }
    addObtainableItem(item, pourcentage, quantity) {
        this.itemsobtainable.push({
            item: item,
            pourcentage: pourcentage,
            quantity: quantity
        })
    }
    removeObtainableItem(id) {
        this.itemsobtainable.splice(id)
    }

    toString() {
        return {
            guildid: this.guildid,
            id: this.id,
            name: this.name,
            icon: this.icon,
            itemsobtainable: this.itemsobtainable,
        }
    }

    static async getGuildsPlaces(guildid) {
        const itemsfiles = await getDataList(guildid, "places")
        let items = []
        itemsfiles.forEach((e) => {
            items.push(Place.createWithData(e))
        })
        return items
    }
    static async getPlaceById(guildid, id) {
        const item = Place.createWithData(await getData(guildid, "places", id))
        return item
    }
    static createWithData(data) {
        const place = new Place()
        place.id = data.id
        place.icon = data.icon
        place.name = data.name
        place.guildid = data.guildid
        place.itemsobtainable = data.itemsobtainable
        return place
    }
    static async delete(guildid, id) {
        await deleteData(guildid, "places", id)
    }
}

function randomPourcentage() {
    return 100 * Math.random()
}

async function startExploration(interaction = BaseInteraction.prototype, id) {
    const place = !id ? ((await Place.getGuildsPlaces(interaction.guildId))[0]) : await Place.getPlaceById(interaction.guildId, id)
    const items = place.itemsobtainable
    const inv = await Inventory.getInventoryById(interaction.guildId, interaction.user.id)
    const field = []
    items.forEach((e) => {
        if (randomPourcentage() <= e.pourcentage) {
            inv[e.item] = inv[e.item] + e.quantity
            const inlin = field.length % 3 == 0
            field.push({
                name: e.item,
                value: `${getTranslation("quantity", interaction.locale)} : ${e.quantity}`,
                inline: !inlin
            })
        }
    })
    await inv.save()
    return field
}

module.exports = {
    Place,
    startExploration
}