import {search} from "./search_anime";
import {Anime} from "./Anime";
import {number_input} from "./input";
import {config_interface} from "./interfaces";

async function download(cache_folder:string, config:config_interface){
    try{
        console.clear()
        let temp_:any = await search()
        if (temp_ == 1){
            return 2;
        }
        let download_id:string = temp_
        let download: Anime = new Anime();
        await download.init(download_id, cache_folder)
        let start_ep_number:number;
        let end_ep_number:number;
        if (download.episode_list.length <= 1){
            start_ep_number = 1
            end_ep_number = 0
        }else{
            console.log(`Select start episode [1-${download.episode_list.length}]`)
            start_ep_number = await number_input(download.episode_list.length)
            console.log(`Select end episode [${start_ep_number}-${download.episode_list.length}]`)
            end_ep_number = await number_input(download.episode_list.length, start_ep_number)-1
        }
        await download.download(start_ep_number-1, config.download_folder, end_ep_number)
    }catch{
        return 1;
    }
    return 0;
}


export {download}