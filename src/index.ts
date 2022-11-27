#!/usr/bin/env node
process.removeAllListeners() // Ignore warning

// External

import _appDataFolder from "appdata-path";
const chalk = require("chalk")

// Internal
import {Anime} from "./Anime";
import {search} from "./search_anime";
import {load_config} from "./load_config";
import {selection, number_input} from "./input";
import {config_} from "./change_config";
import {download} from "./download";
import fs from "fs";

const app_data_folder:string = _appDataFolder()
const cache_folder:string = app_data_folder+"/ani-cli-npm"


console.clear()
async function main(){
    let config = load_config(app_data_folder)
    console.log(chalk.magenta("Ani-cli-npm!\n"))
    if (config.most_recent.anime_id !== ""){
        console.log(chalk.grey(`Most recently played: ${config.most_recent.anime_id} episode ${config.most_recent.episode_number+1}\n`))
    }
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
                console.log(`Select episode [1-${anime.episode_list.length}]`)
                episode_number = await number_input(anime.episode_list.length)-1
            }
            await anime.play_head(episode_number, config, cache_folder)
            await anime.player.quit()
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
            if (continue_anime.player != 0 && continue_anime.player != 1){
                await continue_anime.player.quit()
            }await main()
            break
        case 2: // Download
            let code:number = await download(cache_folder, config)
            if (code == 1){
                console.log(chalk.red("Error downloading episodes"))
            }
            await main()
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
                    console.log(chalk.yellow("Config changed."))
                    break
                } else if (exit_code === 2) {
                    temp = config
                    console.clear()
                    console.log(chalk.yellow("Config changes disregarded."))
                    break
                }
            }
            try{
                fs.writeFileSync(cache_folder+"/config.conf", JSON.stringify(config))
            }catch{
                console.log(chalk.red("Error writing to .conf file."))
            }
            await main()
            break
        case 4: // Quit
            console.log("Exit")
    }

    // await search()
}

main()