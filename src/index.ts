// process.removeAllListeners() // Ignore warning

// External
import * as fetch from "node-fetch"
import * as open from "open"
import * as getAppDataPath from "appdata-path"
import * as fs from "fs"
import * as downloadsFolder from "node-fetch"
// const downloadsFolder = require('downloads-folder');
const dl = require("download-file-with-progressbar");
const prompt = require("simple-input");
const PlayerController = require("media-player-controller")

// Internal
import {config} from "./load_config";
import {Anime} from "./Anime";


async function main(){
    let anime = new Anime()
    await anime.init("naruto")
    console.log("done")
}

main()