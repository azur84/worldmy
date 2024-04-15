const { readdirSync, readFileSync } = require('fs');
const path = require('path');

const tranlationfiles = readdirSync(path.resolve("locales")).filter(e => e.endsWith(".json"))
let locals = {}
tranlationfiles.forEach((e) => {
    const file = JSON.parse(readFileSync(path.join(path.resolve("locales"), e)))
    const localname = e.slice(0, -5)
    locals[localname] = file
})

function getTranslation(key, id, withoutmain = false) {
    if (withoutmain) {
        return getPropertyValue(locals?.[id], key)
    } else {
        return getPropertyValue(locals?.[id], key) || getMainTranslation(key)
    }
}

function getMainTranslation(key) {
    const str = getPropertyValue(locals?.["en_main"], key)
    if (!str) {
        console.error(`missing main key : ${key}`)
        debugger
    }
    return str
}

function getAllTranslation(tranlationkey) {
    let rep = {}
    for (const [key, value] of Object.entries(locals)) {
        if (key === "en_main") continue
        const lo = getPropertyValue(value, tranlationkey)
        if (!lo) continue
        rep[key] = lo
    }
    return rep
}

function getPropertyValue(obj, path) {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
        if (current?.[part] == undefined) {
            return undefined;
        }
        current = current[part];
    }
    return current;
}

module.exports = {
    getTranslation,
    getAllTranslation,
    getMainTranslation
}