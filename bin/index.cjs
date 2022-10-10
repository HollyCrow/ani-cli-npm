#! /usr/bin/env node
const args = process.argv.slice(2);
const fs = require("fs");
const request = require("request-promise")

function matchRuleShort(str, rule) {
    let escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
    return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str)
}


async function search_anime(search){
    let filter = "*<ahref=\"/category/*\"title=\"*\">"
    await request({
        url: "https://gogoanime.lu//search.html?keyword="+search
    }, function(error, response, body){
        let html = body.split('\n')
        let lines = []
        for (let x in html){
            html[x] = html[x].replace(/ /g,'').replace(/\t/g,'')
            if (matchRuleShort(html[x], filter)){
                lines.push(html[x])
            }
        }
        let text = ""
        for (let x in lines){
            lines[x] = lines[x].replace("<ahref=\"/category/", "").replace("\"title=\"", "").replace("\">", "").replaceAll("-", " ")
            lines[x] = lines[x].slice(0, Math.ceil(lines[x].length / 2)+1);
            text += lines[x]+"\n"
        }

        fs.writeFileSync("./temp.txt", text, function(err) {
            if(err) {
                return console.log(err);
            }
        });
    })



    let text = fs.readFileSync("./temp.txt").toString().split("\n");
    text.pop()
    return text
}

async function main(){
    console.log("Animaes: ")
    console.log(await search_anime("sword art online"))
}

main()

