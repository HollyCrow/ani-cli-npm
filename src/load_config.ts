import * as fs from "fs"
//import chalk from 'chalk';

import {config_interface} from "./interfaces";


function write_config(conf_file:string, config:object){
    try{
        fs.writeFileSync(conf_file, JSON.stringify(config))
    }catch{
        console.log(("Failed to write to config file."))
    }
}

function load_config(conf_file: string){
    let config: config_interface = {
        player: "BROWSER",
        proxy: "",
        user_agent: "Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/100.0",
        most_recent: {
            episode_number: 0,
            anime_id: ""
        },
        download_folder: "."
    }
    if (fs.existsSync(conf_file)){
        // @ts-ignore
        let tmp = JSON.parse(fs.readFileSync(conf_file), "utf8")

        // @ts-ignore
        if (tmp.player !== undefined) config.player = tmp.player;
        // @ts-ignore
        if (tmp.proxy !== undefined) config.proxy = tmp.proxy;
        // @ts-ignore
        if (tmp.user_agent !== undefined) config.user_agent = tmp.user_agent;
        // @ts-ignore
        if (tmp.most_recent !== undefined) {
            // @ts-ignore
            if (tmp.most_recent.episode_number !== undefined) config.most_recent.episode_number = tmp.most_recent.episode_number;
            // @ts-ignore
            if (tmp.most_recent.anime_id !== undefined) config.most_recent.anime_id = tmp.most_recent.anime_id;
        }
        // @ts-ignore
        if (tmp.download_folder !== undefined) config.download_folder = tmp.download_folder;
    }

    write_config(conf_file, config)

    return config
}

export {load_config}
