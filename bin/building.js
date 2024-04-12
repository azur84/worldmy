const { writeData, getDataList, getData, deleteData } = require('./data');

class BuildingBuilder {
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
        const item = Building.createWithData(this.data)
        item.save()
        return item
    }
}

class Building {
    guildid = ""
    id = ""
    name = ""
    icon = ""
    static Builder = BuildingBuilder

    async save() {
        await writeData(this.guildid, "buildings", this.id, this)
    }

    toString() {
        return {
            guildid: this.guildid,
            id: this.id,
            name: this.name,
            icon: this.icon,
        }
    }

    static async getGuildsBuildings(guildid) {
        const itemsfiles = await getDataList(guildid, "buildings")
        let items = []
        itemsfiles.forEach((e) => {
            items.push(Building.createWithData(e))
        })
        return items
    }
    static async getBuildingById(guildid, id) {
        const item = Building.createWithData(await getData(guildid, "buildings", id))
        return item
    }
    static createWithData(data) {
        const Building = new Building()
        Building.id = data.id
        Building.icon = data.icon
        Building.name = data.name
        Building.guildid = data.guildid
        return Building
    }
    static async delete(guildid, id) {
        await deleteData(guildid, "buildings", id)
    }
}

module.exports = {
    Building
}