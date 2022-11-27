const fetch = require("node-fetch")
async function curl(url: string, method="GET", redirect = false){
    //try{
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
    })/*.catch(async function(err) {
        console.warn(colors.Red, `Something went wrong connecting to ${url}.`);
        await search();
        process.exit()
    })*/
    if (redirect){
        return response.url
    }else{
        return await response.text()
    }
    /*}catch{
        console.log(colors.Red, "Something went wrong in curl()")
        await main()
    }*/

}

export {curl}