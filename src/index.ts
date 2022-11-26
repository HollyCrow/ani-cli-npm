// process.removeAllListeners() // Ignore warning

// External
import * as fetch from "node-fetch"
import * as open from "open"
import _appDataFolder from "appdata-path";
import * as downloadsFolder from "node-fetch"
// const downloadsFolder = require('downloads-folder');
const dl = require("download-file-with-progressbar");
const prompt = require("simple-input");
const PlayerController = require("media-player-controller")


// Internal
import {Anime} from "./Anime";
import {search_anime} from "./search_anime";
import {load_config} from "./load_config";
import {search_cache, clear_cache, new_cache} from "./cache";
const app_data_folder:string = _appDataFolder()
const cache_folder:string = app_data_folder+"/ani-cli-npm"

let config = load_config(app_data_folder)


async function main(){
    console.log(search_cache(cache_folder, "naruto"))
}

main()