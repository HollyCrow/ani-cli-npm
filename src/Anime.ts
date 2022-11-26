import {curl} from "./curl";
import {RegexParse} from "./regex";
import {generate_link} from "./generate_link";
import {config_interface} from "./interfaces";
import {search_cache, new_cache} from "./cache";

// const gogohd_url="https://gogohd.net/"
const base_url="https://animixplay.to"


class Anime{
    public id: string = ""
    public episode_list: string[] = []

    async init(anime_id: string, cache_folder:string){ // init mate
        let cache_object = search_cache(cache_folder, anime_id)
        this.id = anime_id
        if (cache_object == 0){
            await this.get_ap_bases(anime_id)
        }else{
            try{
                this.episode_list = cache_object.episode_list
            }catch{
                await this.get_ap_bases(anime_id)
            }
        }



        return 0;
    }

    async get_episode_link(episode:number, config:config_interface){
        let episode_dpage = this.episode_list[episode]
        let id = episode_dpage.replace("//gogohd.net/streaming.php?id=","")
        id = id.slice(0, id.indexOf("="))
        let link = await generate_link(1,id, config)
        if (!link){
            link = await generate_link(2,id, config)
        }
        return link
    }

    async get_ap_bases(anime_id:string){
        let list = []
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
    }
}

export {Anime}