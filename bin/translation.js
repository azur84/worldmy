const { readdirSync, readFileSync } = require('fs');
const path = require('path');

const tranlationfiles = readdirSync(path.resolve("locales")).filter(e => e.endsWith(".json"))
let locals = {}
tranlationfiles.forEach((e) => {
    const file = JSON.parse(readFileSync(path.join(path.resolve("locales"), e)))
    const localname = e.slice(0, -5)
    locals[localname] = file
})

function getTranslation(key, id, noUpper = false, withoutmain = false) {
    if (withoutmain) {
        const value = getPropertyValue(locals?.[id], key)
        return noUpper ? value.toLowerCase() : value
    } else {
        const value = (getPropertyValue(locals?.[id], key) || getMainTranslation(key))
        return noUpper ? value.toLowerCase() : value
    }
}

function getMainTranslation(key, noUpper = false) {
    const str = getPropertyValue(locals?.["en_main"], key)
    if (!str) {
        console.error(`missing main key : ${key}`)
        debugger
    }
    return noUpper ? str.toLowerCase() : str
}

function getAllTranslation(tranlationkey, noUpper = false) {
    let rep = {}
    for (const [key, value] of Object.entries(locals)) {
        if (key === "en_main") continue
        const lo = getPropertyValue(value, tranlationkey, noUpper)
        if (!lo) continue
        rep[key] = noUpper ? lo.toLowerCase() : lo
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