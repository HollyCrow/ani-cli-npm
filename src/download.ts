import {search} from "./search_anime";
import {Anime} from "./Anime";
import {number_input} from "./input";
import {range} from "./libs";
import chalk from "chalk";
import {config_interface} from "./interfaces";

async function download(cache_folder:string, config:config_interface){
    try{
        console.clear()
        let download_id: string = await search()
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
        let to_do: number[] = range(start_ep_number, end_ep_number + 1)
        do {
            for (let x in to_do) {
                try {
                    await download.download(to_do[x] - 1, config.download_folder)
                    to_do.splice(Number(x), 1)
                } catch {
                    console.log(chalk.red("Failed to download episode " + to_do[x]))
                }
            }
            if (to_do[0] !== undefined) { //TODO fix buggy downloads
                console.log(chalk.red("Failed to download episodes: " + to_do) + "\nRetrying...")
            }
        } while (to_do[0] !== undefined)
    }catch{
        return 1;
    }
    return 0;
}


export {download}