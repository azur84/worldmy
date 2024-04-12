const { readdirSync, readFileSync } = require('fs');
const path = require('path');

const tranlationfiles = readdirSync(path.resolve("crowdin")).filter(e => e.endsWith(".json"))
let locals = {}
tranlationfiles.forEach((e) => {
    const file = JSON.parse(readFileSync(path.join(path.resolve("crowdin"), e)))
    const localname = e.slice(0, -5)
    locals[localname] = file
})

function getTranslation(key, id) {
    return getPropertyValue(locals?.[id], key)
}

function getMainTranslation(key) {
    return getPropertyValue(locals?.["en_main"], key)
}

function getAllTranslation(tranlationkey) {
    let rep = {}
    for (const [key, value] of Object.entries(locals)) {
        if (key === "en_main") break
        const lo = getPropertyValue(value, tranlationkey)
        if (!lo) break
        rep[key] = lo
    }
    return rep
}

function getPropertyValue(obj, path) {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
        if (current?.[part] === undefined) {
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