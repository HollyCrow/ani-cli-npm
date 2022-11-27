// process.removeAllListeners() // Ignore warning

// External
import * as fetch from "node-fetch"
import * as open from "open"
import _appDataFolder from "appdata-path";
import * as downloadsFolder from "node-fetch"
const chalk = require("chalk")
// const downloadsFolder = require('downloads-folder');
const dl = require("download-file-with-progressbar");
const prompt = require("simple-input");
const PlayerController = require("media-player-controller")

// Internal
import {Anime} from "./Anime";
import {search} from "./search_anime";
import {load_config} from "./load_config";
import {selection, input, number_input} from "./input";

const app_data_folder:string = _appDataFolder()
const cache_folder:string = app_data_folder+"/ani-cli-npm"
//let config = load_config(app_data_folder)


console.clear()
async function main(){
    let config = load_config(app_data_folder)
    console.log(chalk.magenta("Ani-cli-npm!\n"))
    let choice:number = await selection([
        "Search",
        "Continue",
        "Download",
        "Option",
        "Quit",
    ], ["s", "c", "d", "o", "q"],
        ((thing:string) => {return chalk.magenta(thing)}),
        ((thing:string) => {return chalk.magenta(thing)})
    )

    switch(choice){
        case 0:
            let anime_id:string = await search()

            let anime:Anime = new Anime();
            await anime.init(anime_id, cache_folder)
            console.log(`Select episode [1-${anime.episode_list.length}]`)
            let episode_number:number = await number_input(anime.episode_list.length)-1

            await anime.play_head(episode_number, config, cache_folder)
            await anime.player.quit()
            await main()
            break
        case 1:
            if (config.most_recent.anime_id == ""){
                console.clear()
                console.log(chalk.red("No episode played recently"))
                await main()
                break
            }
            let continue_anime:Anime = new Anime()
            await continue_anime.init(config.most_recent.anime_id, cache_folder)
            await continue_anime.play_head(config.most_recent.episode_number, config, cache_folder)
            await continue_anime.player.quit()
            await main()
            break
        case 2:
            console.clear()
            let download_id:string = await search()
            let download:Anime = new Anime();
            await download.init(download_id, cache_folder)
            console.log(`Select start episode [1-${download.episode_list.length}]`)
            let start_ep_number:number = await number_input(download.episode_list.length)
            console.log(`Select end episode [${start_ep_number}-${download.episode_list.length}]`)
            let end_ep_number:number = await number_input(download.episode_list.length, start_ep_number)
            let fails:number[] = []
            for (let episode:number = start_ep_number-1; episode <= end_ep_number; episode++){
                try{
                    (await download.download(episode, config.download_folder))
                }catch{
                    try{
                        (await download.download(episode, config.download_folder))
                    }catch{
                        console.log(chalk.red("Failed to download episode "+episode))
                        fails.push(episode)
                    }
                }
            }
            if (fails[0] !== undefined){ //TODO fix buggy downloads
                console.log(chalk.red("Failed to download episodes: "+fails))
            }
            await main()
            break
        case 3:
            console.log("Options") //TODO Options
            await main()
            break
        case 4:
            console.log("Exit")
    }

    // await search()
}

main()