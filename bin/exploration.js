const { writeData, getDataList, getData, deleteData } = require('./data');

class PlaceBuilder {
    constructor(guildid, id) {
        this.data.guildid = guildid
        this.data.id = id
    }
    data = {
        name: "",
        id: "",
        icon: "",
        guildid: ""
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
    itemstable = {}
    guildid = ""
    id = ""
    name = ""
    icon = ""
    static Builder = PlaceBuilder

    async save() {
        await writeData(this.guildid, "places", this.id, this)
    }

    toString() {
        return {
            guildid: this.guildid,
            id: this.id,
            name: this.name,
            icon: this.icon,
            itemstable: this.itemstable,
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
        return place
    }
    static async delete(guildid, id) {
        await deleteData(guildid, "places", id)
    }
}

module.exports = {
    Place
}