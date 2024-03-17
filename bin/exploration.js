const { existsSync, mkdirSync, writeFileSync, rmSync, readdirSync } = require('fs');
const path = require('path');
class Place {
    itemstable = {}
    constructor(guildid, id, name, icon, get = false) {
        this.guildid = guildid
        this.id = id
        this.name = name
        this.icon = icon
        if (!existsSync(path.join(process.env.basepath, "serveurs", this.guildid, "places"))) {
            mkdirSync(path.join(process.env.basepath, "serveurs", this.guildid, "places"), { recursive: true })
        }
        if (get) {
            return
        }
        if (existsSync(path.join(process.env.basepath, "serveurs", this.guildid, "places", `${this.id}.json`))) {
            throw new Error("Already created !")
        }
        writeFileSync(path.join(process.env.basepath, "serveurs", this.guildid, "places", `${this.id}.json`), JSON.stringify(this))
    }

    save() {
        writeFileSync(path.join(process.env.basepath, "serveurs", this.guildid, "places", `${this.id}.json`), JSON.stringify(this))
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

    static getGuildsPlaces(guildid) {
        if (!existsSync(path.join(process.env.basepath, "serveurs", guildid, "places"))) {
            mkdirSync(path.join(process.env.basepath, "serveurs", guildid, "places"), { recursive: true })
        }
        const itemsfiles = readdirSync(path.join(process.env.basepath, "serveurs", guildid, "places"), { withFileTypes: true })
        let items = []
        itemsfiles.forEach((e) => {
            items.push(Place.createWithFiles(require(path.join(e.path, e.name))))
        })
        return items
    }
    static getPlaceById(guildid, id) {
        const item = Place.createWithFiles(require(path.join(process.env.basepath, "serveurs", guildid, "places", `${id}.json`)))
        return item
    }
    static createWithFiles(file) {
        const place = new Place(file.guildid, file.id, file.name, file.icon, true)
        place.items = file.items
        return place
    }
    static delete(guildid, id) {
        if (!existsSync(path.join(process.env.basepath, "serveurs", guildid, "places", `${id}.json`))) {
            throw new Error("Don't exist !")
        }
        rmSync(path.join(process.env.basepath, "serveurs", guildid, "places", `${id}.json`))
    }
}

module.exports = {
    Place
}