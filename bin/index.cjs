#! /usr/bin/env node
const args = process.argv.slice(2);
const fs = require("fs");
const request = require("request")
const reg = fs.readFileSync("regex.reg").toString().replace(/ /g,'');

function matchRuleShort(str, rule) {
    let escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
}
const https = require('https');
async function search_anime(search){
    let all = []
    await request({
        url: "https://gogoanime.lu//search.html?keyword="+search
    }, await function(error, response, body){
        let html = body.split('\n')
        let lines = []
        for (let x in html){
            html[x] = html[x].replace(/ /g,'').replace(/\t/g,'')
            if (matchRuleShort(html[x], reg)){
                lines.push(html[x])
                console.log(html[x])
            }
        }
        return lines
    })


}

async function main(){
    console.log(await search_anime("one"))
}

main()

