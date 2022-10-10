#! /usr/bin/env node
const args = process.argv.slice(2);
const fs = require("fs");
const request = require("request-promise");
const http = require('http');

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
        text[x] = text[x].slice(text[x].indexOf("/category/")+10);
        text[x] = text[x].slice(0, text[x].indexOf("\"title=")).replaceAll("-", " ");
    }
    text.pop()
    return text
}


async function download(url, name){
    let file = fs.createWriteStream("./../downloads/"+name)
    http.get(url, function(response) {
        response.pipe(file);
        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            console.log(`Downloaded: ${name}`);
        });
    });
}





async function main(){
    console.log("Animaes: ")
    console.log(await search_anime("sword art online"))

    await download("http://techslides.com/demos/sample-videos/small.mp4", "sample.mp4")
}

main()

