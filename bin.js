const { existsSync, readFileSync, writeFileSync, rmSync, readdirSync, writeFile, mkdirSync } = require("fs")

function supermkdir(path) {
    let paths = ""
    path.split('/').forEach(t => {
        paths = paths + t + '/'
        if (!existsSync(paths)) {
            mkdirSync(paths)
        }
    })
}
class GuildClassDefaut {
    guildId = ""
    constructor(guildId, path, pro) {
        this.guildId = guildId
        try {
            const obj = JSON.parse(readFileSync(path))
            Object.keys(obj).forEach(e => {
                this[e] = obj[e]
            })
        } catch (err) {
            Object.keys(pro).forEach(e => {
                this[e] = pro[e]
            })
        }
    }
    write() {
        writeFileSync(this.path(), JSON.stringify(this))
    }
    exists() {
        return existsSync(this.path())
    }
    getFiles() {
        return JSON.parse(readFileSync(this.path()))
    }
    delete() {
        rmSync(this.path())
        delete this
    }
    path() {
        return `./serveurs/${this.guildId}.json`
    }
    toString() { }
}
class ManagerClassDefaut {
    LinkedClass;
    guildId = "";
    constructor(guildId, path) {
        this.guildId = guildId
        supermkdir(path)
    }
    toArray() {
        let returnarray = [];
        readdirSync(this.path()).forEach(id => {
            returnarray.push(JSON.parse(readFileSync(`${this.path()}/${id}.json`)))
        })
        return returnarray
    }
    get(id) {
        return JSON.parse(readFileSync(`${this.path()}/${id}.json`))
    }
    path() {
        return `./serveurs/${this.guildId}`
    }
    delete(id) {
        rmSync(`${this.path()}/${id}.json`)
    }
    new(...args) {
        const newitem = new this.LinkedClass(...args)
        return newitem
    }
    toString() { }
}
class Guild {
    guildId
    constructor(guildId) {
        this.guildId = guildId
        if (guildId == undefined) return
        supermkdir(this.path())
        if (this.exists()) {
            Object.keys(this.getFiles()).forEach(e => {
                this[e] = this.getFiles()[e]
            })
        }
    }
    getFiles() {
        return JSON.parse(readFileSync(this.pathConfig()))
    }
    path() {
        return `./serveurs/${this.guildId}`
    }
    pathConfig() {
        return `./serveurs/${this.guildId}/config.json`
    }
    exists() {
        return existsSync(this.pathConfig())
    }
    items() { return new ItemManager(this.guildId) }
    write() {
        writeFileSync(this.pathConfig(), JSON.stringify(this))
    }
    toString() {
        return {}
    }


}
class Item extends GuildClassDefaut {
    constructor(guildId, id, name, icon) {
        super(guildId, `./serveurs/${guildId}/items/${id}.json`, { id: id, name: name, icon: icon })
        this.guildId = guildId
        this.write()
    }
    path() {
        return `./serveurs/${this.guildId}/items/${this.id}.json`
    }
    toString() {
        return {
            id: this.id,
            icon: this.icon,
            name: this.name,
        }
    }
}
class ItemManager extends ManagerClassDefaut {
    LinkedClass = Item;
    guildId = ""
    constructor(guildId) {
        super(guildId, `./serveurs/${guildId}/items`)
        this.guildId = guildId
    }
    path() {
        return `./serveurs/${this.guildId}/items`
    }
    new(id, name, icon) {
        const item = new this.LinkedClass(this.guildId, id, name, icon)
        return item
    }
}
class ShopShelf extends GuildClassDefaut {
    guildId = ""
    constructor(guildId, id, itemid, cost, forsale, seller) {
        super(guildId, `./serveurs/${guildId}/shop/${id}.json`, { id: id, itemid: itemid, cost: cost, forsale: forsale, seller: seller })
        this.guildId = guildId
    }
    path() {
        return `./serveurs/${this.guildId}/shop/${this.id}.json`
    }
    toString() {
        return {
            id: this.id,
            itemid: this.itemid,
            cost: this.cost,
            forsale: this.forsale,
            seller: this.seller
        }
    }
}

module.exports = {
    Guild,
    supermkdir
}