const { writeData, getDataList, getData, deleteData } = require('./data')

class Inventory {
    constructor(data, guildid, id) {
        this.guildid = guildid
        this.id = id
        Object.assign(this, data)
    }
    async save() {
        await writeData(this.guildid, "inventory", this.id, this)
    }
    // toString() {
    //     return ``
    // }
    toJSON() {
        let inv = {}
        Object.entries(this).forEach(([key,value]) => {
            if (key == "id"||key == "guildid") return
            inv[key] = value
        })
        return inv
    }
    static async getInventoryById(guildid, id) {
        const item = new Inventory(await getData(guildid, "inventory", id), guildid, id)
        return item
    }
}

module.exports = {
    Inventory,
}