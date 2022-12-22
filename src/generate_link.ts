const gogohd_url="https://gogohd.pro/"
const base_url="https://animixplay.to"

import {curl} from "./core_utils/curl";
import {RegexParse} from "./core_utils/regex";


async function generate_link(provider: number, id: string, player:string){
    let html_:string = ""
    let provider_name = ""
    switch (provider) {
        case 1:
            html_ = await curl(`${gogohd_url}streaming.php?id=${id}`)
            provider_name = 'Xstreamcdn'
            console.log(`Fetching ${provider_name} links...`)
            let html: string[] = html_.split("\n")
            let fb_id = ""
            for (let x in html){
                if (RegexParse(html[x], "*<li class=\"linkserver\" data-status=\"1\" data-video=\"https://fembed9hd.com/v/*")){
                    fb_id = html[x].slice(html[x].indexOf("/v/")+3, html[x].indexOf("\">X"))
                    break
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
        case 2:
            provider_name = 'Animixplay'
            console.log(`Fetching ${provider_name} links...`)
            let buffer = new Buffer(id)
            let enc_id = buffer.toString("base64")
            buffer = new Buffer(id+"LTXs3GrU8we9O"+enc_id)
            let ani_id = buffer.toString("base64")
            buffer = Buffer.from((await curl(`${base_url}/api/live${ani_id}`, "GET", true)).split("#")[1], "base64")
            if (player === "BROWSER"){
                return `${base_url}/api/live${ani_id}`
            }
            return buffer.toString("utf-8")
    }
}


export { generate_link }