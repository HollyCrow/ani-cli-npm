import {curl} from "./curl";
import {RegexParse} from "./regex";

// const gogohd_url="https://gogohd.net/"
const base_url="https://animixplay.to"

class Anime{
    id: string = ""
    current_episodes: number = 0
    episode_list: string[] = []

    async init(anime_id: string){

        this.id = anime_id

        let html = (await(curl(base_url+"/v1/"+anime_id))).split("\n")
        let lines = ""

        for (let x in html){
            if(RegexParse(html[x], "*<div id=\"epslistplace\"*")){
                lines = (html[x])
            }
        }
        lines = lines.slice(55, lines.length).replace("}</div>", "")
        lines = "{" + lines.slice(lines.indexOf(",")+1, lines.length) + "}"
        let json = JSON.parse(lines)
        for (const value of Object.entries(json) as unknown as string[]) {
            this.episode_list.push(value[1])
        }
console.log(this.episode_list)

        return 0;
    }

}

export {Anime}