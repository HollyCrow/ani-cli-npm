const chalk = require("chalk")
import {selection, input} from "./input";
import {config_interface} from "./interfaces";


async function config_(temp:config_interface){
    /*
    ## Lets user change a single attribute of config. Returns new config object, and an exit code
     */
    console.clear()
    console.log(chalk.blue("ANI-CLI-NPM \n"))
    console.log(chalk.yellow("Config:\n"))
    let choice = await selection([
        "Player; "+temp.player,
        "Proxy; "+temp.proxy,
        "User agent; "+temp.user_agent,
        "Downloads folder; "+temp.download_folder,
        "Save and exit",
        "Exit without saving"
    ], [], ((item) => {return chalk.cyan(item)}), ((item) => {return chalk.cyan(item)}))
    switch (choice){
        case 0:
            let player = await selection([
                "VLC      - VLC media player",
                "Browser  - Play in default browser",
                "MPV      - MPV media player",
                "Link     - Simply display the link in console"
            ], [], ((item) => {return chalk.cyan(item)}), ((item) => {return chalk.cyan(item)}))
            switch (player){
                case 0:
                    temp.player = "VLC"
                    break
                case 1:
                    temp.player = "BROWSER"
                    break
                case 2:
                    temp.player = "MPV"
                    break
                case 3:
                    temp.player = "LINK"
                    break
            }
            // @ts-ignore
            return temp,0
        case 1:
            console.log(chalk.cyan("New Proxy;"))
            temp.proxy = (await(input())).replaceAll(" ", "")
            // @ts-ignore
            return temp, 0
        case 2:
            console.log(chalk.cyan("New User Agent"))
            temp.user_agent = await(input())
            // @ts-ignore
            return temp, 0
        case 3:
            console.log(chalk.cyan("New Downloads Folder"))
            temp.download_folder = await(input())
            // @ts-ignore
            return temp, 0
        case 4:
            // @ts-ignore
            return temp, 1
        case 5:
            // @ts-ignore
            return temp, 2
    }
}

export {config_}