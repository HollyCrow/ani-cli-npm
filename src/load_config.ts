import * as fs from "fs"
//import chalk from 'chalk';

import {config_interface} from "./interfaces";

function make_config_dir(cache_dir:string, debug:boolean){
    try{
        if (!fs.existsSync(cache_dir+"/")) fs.mkdirSync(cache_dir+"/");
    }catch{
        if (debug){
            console.log("Failed to make cache dir")
        }
    }
}

function write_config(cache_dir:string, config:config_interface){
    try{
        //make_config_dir(cache_dir, config.debug_mode)
        fs.writeFileSync(cache_dir+"/config.conf", JSON.stringify(config), "utf-8")
    }catch{
        console.log(("Failed to write to config file."))
    }
}

function load_config(cache_dir: string){
    let config: config_interface = {
        player: "BROWSER",
        proxy: "",
        user_agent: "Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/100.0",
        most_recent: {
            episode_number: 0,
            anime_id: ""
        },
        download_folder: ".",
        debug_mode: false
    }
    if (fs.existsSync(cache_dir+"/config.conf")){
        // @ts-ignore
        let tmp = JSON.parse(fs.readFileSync(cache_dir+"/config.conf"), "utf8")

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

    write_config(cache_dir, config)

    return config
}

export {load_config, write_config, make_config_dir}
