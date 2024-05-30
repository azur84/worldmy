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
function inPrimaryFactors(nombre) {
    let facteurs = [];
    let diviseur = 2;

    while (diviseur * diviseur <= nombre) {
        while (nombre % diviseur === 0) {
            facteurs.push(diviseur);
            nombre /= diviseur;
        }
        diviseur += 2;
    }

    if (nombre > 2) {
        facteurs.push(nombre);
    }

    return facteurs;
}
function findCommonDivisors(nombre1, nombre2) {
    let diviseursCommuns = [];
  
    while (nombre2 !== 0) {
      const temp = nombre2;
      nombre2 = nombre1 % nombre2;
      nombre1 = temp;
    }
  
    diviseursCommuns.push(nombre1);
    let pgcd = nombre1;
    let i = 2;
    while (i * i <= pgcd) {
      while (pgcd % i === 0) {
        diviseursCommuns.push(i);
        pgcd /= i;
      }
      i += 2;
    }
  
    if (pgcd > 1) {
      diviseursCommuns.push(pgcd);
    }
  
    return diviseursCommuns;
  }
  

module.exports = {
    timer,
    paramCustomId,
    inPrimaryFactors,
    findCommonDivisors
}