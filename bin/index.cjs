#! /usr/bin/env node
const args = process.argv.slice(2);
const fs = require("fs");
const request = require("request-promise");
const http = require('http');

const HttpsProxyAgent = require('https-proxy-agent');
const proxyAgent = new HttpsProxyAgent("68.183.230.116:3951");

const agent="Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/100.0"
const PID=0
const scrape = "Query"
const quality="best"
const fzf = 0
const auto_play=0
const download_dir = "./../downloads/"
const gogohd_url="https://gogohd.net"
const base_url="https://animixplay.to"
const player_fn = "download"

async function curl(url){
    fetch(url, {
        "agent": proxyAgent,
        "headers": {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/100.0'
        },
        "referrerPolicy": "origin",
        "body": null,
        "method": "GET",
        "proxy": "68.183.230.116:3951"
    }).then(function (response) {
        return response.text();
    }).then(function (html) {
        fs.writeFileSync("./temp.txt", html, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    }).catch(function (err) {
        console.warn(`Something went wrong connecting to ${url}.`, err);
    });

    return fs.readFileSync("./temp.txt").toString()
}


function matchRuleShort(str, rule) {
    let escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
}


async function search_anime(search){
    let filter = "*<ahref=\"/category/*\"title=\"*\">"

    let html = (await curl("https://gogoanime.lu//search.html?keyword="+search)).split("\n")
    let lines = []
    for (x in html){
        html[x] = html[x].replace(/ /g,'').replace(/\t/g,'')
        if (matchRuleShort(html[x], filter)){
            html[x] = html[x].slice(html[x].indexOf("/category/")+10);
            html[x] = html[x].slice(0, html[x].indexOf("\"title="));
            lines.push(html[x])
        }
    }
    lines.pop()

    return lines
}


async function episode_list(anime_id){
    let html = (await curl(base_url+"/v1/"+anime_id)).split("\n")
    let lines = ""
    for (x in html){
        if(matchRuleShort(html[x], "*epslistplace*")){
            lines = (html[x])
        }
    }
    lines = lines.slice(55, lines.length).replace("}</div>", "")
    lines = "{" + lines.slice(lines.indexOf(",")+1, lines.length) + "}"
    lines = JSON.parse(lines)
    let json = []
    for (x in lines){
        json.push(lines[x])
    }
    return json
}


async function download(url, name){
    let file = fs.createWriteStream(download_dir+name)
    http.get(url, function(response) {
        response.pipe(file);
        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            console.log(`Downloaded: ${name}`);
        });
    });
}


function episode_selection(episodes){
    let selection
    while (true){
        selection = prompt("Select an episode: \n>")
        if (selection < episodes && selection > 1){
            break
        }
    }
    return selection
}

function anime_selection(list){
    let selection
    while (true){
        selection = prompt("Select an anime: \n>")
        if (selection <= list.length && selection > 1){
            break
        }
        console.log("Please input a valid option.")
    }
    return list[selection]
}


async function process_search(query){
    console.log("Searching: "+query)
    let search_results = await search_anime(query)
    if (!search_results[0]){
        console.log("No results.")
        return 0
    }else{
        for (x in search_results){
            console.log(`${parseInt(x)+1})${" ".repeat(((search_results.length).toString().length+1)-((parseInt(x)+1).toString().length))}${search_results[x].replaceAll("-", " ")}`)
        }
    }
    let anime_id = anime_selection(search_results)
    let episode = episode_selection(episode_list(anime_id))
    return 0
}

async function main(){
    await process_search("sword art online")
}

main()

