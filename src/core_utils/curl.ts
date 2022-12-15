const fetch = require("node-fetch")
const chalk = require("chalk")
async function curl(url: string, method="GET", redirect = false){
    try{
    let response = await fetch(url, {
        //"agent": proxyAgent,
        "headers": {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/100.0',
            "X-Requested-With": "XMLHttpRequest"
        },
        "referrerPolicy": "origin",
        "body": null,
        "method": method,
        "redirect": 'follow',
        // "follow": 10,
    }).catch(async function(err:string) {
        console.warn(chalk.red(`Something went wrong connecting to ${url}. ${err}`));
        process.exit()
    })
    if (redirect){
        return response.url
    }else{
        return await response.text()
    }
    }catch{
        console.log(chalk.red("Something went wrong in curl()"))
        process.exit()
    }

}

export {curl}