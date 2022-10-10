#! /usr/bin/env node
const args = process.argv.slice(2);
const fs = require("fs");
const request = require("request-promise")

function matchRuleShort(str, rule) {
    let escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
}


async function search_anime(search){
    let filter = "*<ahref=\"/category/*\"title=\"*\">"
    let x = await request({
        url: "https://gogoanime.lu//search.html?keyword="+search
    }, function(error, response, body){
        let html = body.split('\n')
        let lines = ""
        for (let x in html){
            html[x] = html[x].replace(/ /g,'').replace(/\t/g,'')
            if (matchRuleShort(html[x], filter)){
                lines += html[x]+"\n"
            }
        }
        fs.writeFileSync("./temp.txt", lines, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    })

    let text = fs.readFileSync("./temp.txt").toString().split("\n");

    for (x in text){
        text[x] = text[x].replace("<ahref=\"/category/", "").replace("\"title=\"", "").replace("\">", "")
        text[x] = text[x].slice(0, Math.ceil(text[x].length / 2));
    }
    text.pop()

    return text
}

async function main(){
    console.log(await search_anime("sword art online"))
}

main()

