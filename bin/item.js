const { writeData, getDataList, getData, deleteData } = require('./data')

class ItemBuilder {
    constructor(guildid,id) {
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
        const item = Item.createWithData(this.data)
        item.save()
        return item
    }
}

class Item {
    guildid = ""
    id = ""
    name = ""
    icon = ""
    static Builder = ItemBuilder

    async save() {
        await writeData(this.guildid, "items", this.id, this)
    }

    toString() {
        return {
            guildid: this.guildid,
            id: this.id,
            name: this.name,
            icon: this.icon
        }
    }

    static async getGuildsItems(guildid) {
        const itemsfiles = await getDataList(guildid, "items")
        let items = []
        itemsfiles.forEach((e) => {
            items.push(Item.createWithData(e))
        })
        return items
    }
    static async getItemById(guildid, id) {
        const item = await getData(guildid, "items", id)
        return item
    }
    static createWithData(data) {
        const item = new Item()
        item.guildid = data.guildid
        item.icon = data.icon
        item.id = data.id
        item.name = data.name
        return item
    }
    static async delete(guildid, id) {
        await deleteData(guildid, "items", id)
    }
}

module.exports = {
    Item,
}