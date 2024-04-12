const Keyv = require("keyv");
require("dotenv").config()

const Data = new Keyv(process.env.DataBaseURI)
Data.on('error', err => console.error(`Connection Error ${err}`));

async function writeData(guildId, type, id, value, withlist = true) {
    Data.opts.namespace = guildId
    await Data.set(`${type}:${id}`, value)
    if (!withlist) return
    const keys = await Data.get(type) || []
    if (!keys.includes(id)) keys.push(id)
    await Data.set(type, keys)
}
async function getData(guildId, type, id) {
    Data.opts.namespace = guildId
    const data = await Data.get(`${type}:${id}`)
    return data
}
async function timeout(guildId, id, userId, timeoutsec) {
    Data.opts.namespace = guildId
    const data = await Data.get(`${id}:${userId}`)
    if (data) {
        return data
    } else {
        if (!timeoutsec) return false
        const t = new Date().getTime()
        const tsec = (t / 1000)
        const tsecar = (tsec + (timeoutsec)).toFixed(0)
        await Data.set(`${id}:${userId}`, tsecar, timeoutsec * 1000)
        return false
    }
}
async function deleteData(guildId, type, id, withlist = true) {
    Data.opts.namespace = guildId
    await Data.delete(`${type}:${id}`)
    if (!withlist) return
    const keys = await Data.get(type) || []
    const keyindex = keys.findIndex((element) => element == id)
    keys.splice(keyindex, 1)
    await Data.set(type, keys)
}
async function getDataList(guildId, type) {
    Data.opts.namespace = guildId
    const keys = await Data.get(type)
    if (!keys) return []
    const datas = keys.map((e) => {
        return new Promise(async (resolve, reject) => {
            const data = await Data.get(`${type}:${e}`)
            resolve(data)
        })
    })
    return await Promise.all(datas)
}
module.exports = {
    writeData,
    getData,
    deleteData,
    getDataList,
    timeout
}