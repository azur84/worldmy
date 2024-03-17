const { readdirSync, existsSync, writeFileSync, rmSync, mkdirSync, } = require('fs')
const path = require('path')
const { } = require("../bin.js")

class Item {
    constructor(guildid, id, name, icon, get = false) {
        this.guildid = guildid
        this.id = id
        this.name = name
        this.icon = icon
        if (!existsSync(path.join(process.env.basepath, "serveurs", this.guildid, "items"))) {
            mkdirSync(path.join(process.env.basepath, "serveurs", this.guildid, "items"), { recursive: true })
        }
        if (get) {
            return
        }
        if (existsSync(path.join(process.env.basepath, "serveurs", this.guildid, "items", `${this.id}.json`))) {
            throw new Error("Already created !")
        }
        writeFileSync(path.join(process.env.basepath, "serveurs", this.guildid, "items", `${this.id}.json`), JSON.stringify(this))
    }
    save() {
        writeFileSync(path.join(process.env.basepath, "serveurs", this.guildid, "items", `${this.id}.json`), JSON.stringify(this))
    }

    toString() {
        return {
            guildid: this.guildid,
            id: this.id,
            name: this.name,
            icon: this.icon
        }
    }

    static getGuildsItems(guildid) {
        if (!existsSync(path.join(process.env.basepath, "serveurs", guildid, "items"))) {
            mkdirSync(path.join(process.env.basepath, "serveurs", guildid, "items"), { recursive: true })
        }
        const itemsfiles = readdirSync(path.join(process.env.basepath, "serveurs", guildid, "items"), { withFileTypes: true })
        let items = []
        itemsfiles.forEach((e) => {
            items.push(Item.createWithFiles(require(path.join(e.path, e.name))))
        })
        return items
    }
    static getItemById(guildid, id) {
        const item = Item.createWithFiles(require(path.join(process.env.basepath, "serveurs", guildid, "items", `${id}.json`)))
        return item
    }
    static createWithFiles(file) {
        return new Item(file.guildid, file.id, file.name, file.icon, true)
    }
    static delete(guildid, id) {
        if (!existsSync(path.join(process.env.basepath, "serveurs", guildid, "items", `${id}.json`))) {
            throw new Error("Don't exist !")
        }
        rmSync(path.join(process.env.basepath, "serveurs", guildid, "items", `${id}.json`))
    }
}

module.exports = {
    Item,
}