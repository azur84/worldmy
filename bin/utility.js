function timer(sectime = 30) {
    const t = new Date().getTime()
    const tsec = (t / 1000)
    const tdicord = (tsec + sectime).toFixed(0)
    return `<t:${tdicord}:R>`
}
function paramCustomId(custom_id) {
    const split = custom_id.split("@")
    const string = split[1]
    const list = string.split("&")
    let parm = {}
    list.forEach((e) => {
        const o = e.split("=")
        parm[o[0]] = o[1]
    })
    return parm
}

module.exports = {
    timer,
    paramCustomId
}