#! /usr/bin/env node

const VLC = require('vlc-simple-player');
const prompt = require("simple-input");
const http = require('http');
const fs = require("fs");
//const HttpsProxyAgent = require('https-proxy-agent');
//const proxyAgent = new HttpsProxyAgent("68.183.230.116:3951");

async function input(message){
    console.log(colors.Magenta,message)
    return await prompt(">")
}

const download_dir = "./../downloads/"
const gogohd_url="https://gogohd.net/"
const base_url="https://animixplay.to"

const colors = {
    Black: "\x1b[30m%s\x1b[0m",
    Red: "\x1b[31m%s\x1b[0m",
    Green: "\x1b[32m%s\x1b[0m",
    Yellow: "\x1b[33m%s\x1b[0m",
    Blue: "\x1b[34m%s\x1b[0m",
    Magenta: "\x1b[35m%s\x1b[0m",
    Cyan: "\x1b[36m%s\x1b[0m",
    White: "\x1b[37m%s\x1b[0m"
}


async function curl(url, method="GET"){
    await fetch(url, {
        //"agent": proxyAgent,
        "headers": {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/100.0',
            "X-Requested-With": "XMLHttpRequest"
        },
        "referrerPolicy": "origin",
        "body": null,
        "method": method,
        "proxy": "68.183.230.116:3951"
    }).then(function (response) {
        return response.text();
    }).then(function (html) {
        fs.writeFileSync("./temp.txt", html, function(err) {
            if(err) {
                return console.log(err);
            }
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

    for (let x in html){
        if(matchRuleShort(html[x], "*<div id=\"epslistplace\"*")){
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


async function selection(options, prompt){
    let selection
    while (!(selection <= options && selection > 1)){
        selection = (await input(prompt))
        if (selection <= options && selection >= 1){
            break
        }
        console.log(colors.Red,`Please input a valid option.`)
    }
    return selection
}


async function process_search(query) {
    console.log("Searching: "+query)

    let search_results = await search_anime(query)
    if (!search_results[0]) {
        console.log("No results.")
        return 0
    } else {
        for (x in search_results) {
            console.log(colors.Cyan,`${parseInt(x)+1})${" ".repeat(((search_results.length).toString().length+1)-((parseInt(x)+1).toString().length))}${search_results[x].replaceAll("-", " ")}`)
        }
    }

    let anime_id = search_results[await selection(search_results.length, "Please select an anime.")-1]
    let episodes = await episode_list(anime_id)
    let episode_number = await selection(episodes.length, `Please select an episode (1-${episodes.length}).`)

    return {
        anime_id: anime_id,
        episodes: episodes,
        episode_number: episode_number
    }
}


async function get_video_link(episode_dpage){
    let id = episode_dpage.replace("//gogohd.net/streaming.php?id=","")
    id = id.slice(0, id.indexOf("="))

    let html = await curl(`${gogohd_url}streaming.php?id=${id}`)
    return await generate_link(1, html)
}


async function generate_link(provider, html){
    switch (provider) {
        case 1:
            let provider_name = 'Xstreamcdn'
            console.log(colors.Cyan, `Fetching ${provider_name} links...`)
            html = html.split("\n")
            let fb_id = ""
            for (x in html){
                if (matchRuleShort(html[x], "*<li class=\"linkserver\" data-status=\"1\" data-video=\"https://fembed9hd.com/v/*")){
                    fb_id = html[x].slice(html[x].indexOf("/v/")+3, html[x].indexOf("\">X"))
                }
            }
            if (!fb_id){
                console.log("Error, no fb_id found.")
                return 0
            }

            //let refr = "https://fembed-hd.com/v/"+fb_id
            let post = await curl("https://fembed-hd.com/api/source/"+fb_id, "POST")
            post = post.slice(post.indexOf(",\"data\":[{\"file\":\"")+18, post.length)
            post = post.slice(0, post.indexOf("\"")).replaceAll("\\/","/")
            return post
    }
}





async function main(){
    let choice = await input("Search anime.")
    let anime = await process_search(choice)

    console.log("\n")

    console.log(colors.Cyan, "Indexing video")
    let link = await get_video_link(anime.episodes[anime.episode_number])

    console.log(colors.Cyan, "Loading VLC... ")
    console.log(colors.Yellow, "URL: "+link)
    
    let player = new VLC(link)
    console.log(colors.Magenta, "VLC Initialised!")

    player.on("exit", (code) => {
        console.log("exit")
    })
}

main()

