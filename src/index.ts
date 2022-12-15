#!/usr/bin/env node
process.removeAllListeners() // Ignore warning

// External

import _appDataFolder from "appdata-path";
const chalk = require("chalk")

// Internal
import {Anime} from "./Anime";
import {search} from "./search_anime";
import {load_config, make_config_dir, write_config} from "./file_managment/load_config";
import {selection, number_input} from "./input";
import {config_} from "./file_managment/change_config";
import {download} from "./download";
import {help} from "./help";

const app_data_folder:string = _appDataFolder()
const cache_folder:string = app_data_folder+"/ani-cli-npm"
make_config_dir(cache_folder, true)

console.clear()
async function main(){
    let config = load_config(cache_folder)
    console.log(chalk.magenta("Ani-cli-npm!\n"))
    if (config.most_recent.anime_id !== ""){
        console.log(chalk.grey(`Most recently played: ${config.most_recent.anime_id} episode ${config.most_recent.episode_number+1}\n`))
    }
    let choice:number = await selection([
        "Search",
        "Continue",
        "Download",
        "Option",
        "Help",
        "Quit",
    ], ["s", "c", "d", "o", "h", "q"],
        ((thing:string) => {return chalk.magenta(thing)}),
        ((thing:string) => {return chalk.magenta(thing)})
    )

    switch(choice){
        case 0: // Search
            let temp_:any = await search()
            if (temp_ == 1){
                await main()
                process.exit()
            }
            let anime_id:string = temp_

            let anime:Anime = new Anime();
            await anime.init(anime_id, cache_folder)
            let episode_number:number
            if (anime.episode_list.length == 1){
                episode_number = 0;
            }else{
                console.log(`Select episode [1-${anime.episode_list.length}] ${(anime.most_recent != 0)? `Or C to continue from ep${anime.most_recent+1}`: ""}`)
                episode_number = await number_input(anime.episode_list.length, 1, (anime.most_recent != 0)? ["c"]: [], (anime.most_recent != 0)? [anime.most_recent+1] : [])
            }
            await anime.play_head(episode_number-1, config, cache_folder)
            if(anime.player.hasOwnProperty("quit")){
                await anime.player.quit()
            }
            await main()
            break
        case 1: // Continue
            if (config.most_recent.anime_id == ""){
                console.clear()
                console.log(chalk.red("No episode played recently"))
                await main()
                break
            }
            let continue_anime:Anime = new Anime()
            await continue_anime.init(config.most_recent.anime_id, cache_folder)
            await continue_anime.play_head(config.most_recent.episode_number, config, cache_folder)
            if(continue_anime.player.hasOwnProperty("quit")){
                await continue_anime.player.quit()
            }
            await main()
            break
        case 2: // Download
            let code:number = await download(cache_folder, config)
            if (code == 1){
                console.log(chalk.red("Error downloading episodes"))
            }
            break
        case 3: // Options
            let temp = structuredClone(config);
            let exit_code;
            while (true) {
                // @ts-ignore
                temp, exit_code = await config_(temp)
                if (exit_code === 1) {
                    config = temp
                    //proxyAgent = new HttpsProxyAgent(config.proxy);
                    console.clear()
                    try{
                        write_config(cache_folder, config)
                        console.log(chalk.yellow("Config changed."))
                    }catch{
                        console.log(chalk.red("Error writing to .conf file."))
                    }
                    break
                } else if (exit_code === 2) {
                    temp = config
                    console.clear()
                    console.log(chalk.yellow("Config changes disregarded."))
                    break
                }
            }

            await main()
            break
        case 4:
            await help()
            break
        case 5: // Quit
            console.log("Exit")
    }
    return 0;

    // await search()
}

main()