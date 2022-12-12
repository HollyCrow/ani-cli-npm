import {selection} from "./input";

const chalk = require("chalk")


const helps = [
    (async () => { // Playing anime
        console.log(chalk.cyan("Playing anime: \n" +
            "  Search: \n" +
            "    Search for a show/movie. This will search on gogoanime.dk.\n" +
            "  Episode selection: \n" +
            "    Once an anime is selected, select an episode. If there is only 1 episode " +
            "(in the case of a movie), the episode will be played automatically.\n" +
            "    The episode selected will be played in the video player selected in options. Info on video players can be found in options help."))
        await help()
        return
    }),
    (async () => { // Downloading anime
        console.log(chalk.cyan("Downloading anime: \n" +
            "  Search: \n" +
            "    Search for a show/movie. This will search on gogoanime.dk.\n" +
            "  Episode selection: \n" +
            "    Once an anime is selected, select a start episode and an end episode. If there is only 1 episode " +
            "(in the case of a movie), the episode will be downloaded automatically. Download folder can be changed in options. Default to run location.\n" +
            "    The selected episodes will be downloaded. It is common for episode links to fail to be fetched, when this happens the episode will be passed, then reattempted in another pass.\n" +
            "    Episodes sourced from Animixplay links will download m3u8 file, which you will have difficulty playing, if you are able to at all."))
        await help()
        return
    }),
    (async () => {
        console.log(chalk.cyan("Options: \n" +
            "  Player: \n" +
            "    Player used to play anime.\n" +
            "  Proxy: \n" +
            "    https proxy address and port in form ip:port. This is not currently implemented.\n" +
            "  User agent:\n" +
            "    node-fetch user agent.\n" +
            "  Downloads folder:\n" +
            "    Folder to place downloaded episodes.\n" +
            "  MPV socket connection file:\n" +
            "    File for mpv socket, used to control mpv instance with outside tools.\n" +
            "  VLC socket:\n" +
            "    VLC http control socket\n" +
            "  VLC pass:\n" +
            "    VLC http control password\n" +
            "  W2G api token:\n" +
            "    Your user access token for w2g.tv. Can be found at https://w2g.tv/en/account/edit_user under Tools/API\n"
        ))
        await help()
        return
    }),
    (async () => {
        return
    })

]


async function help(){
    console.log(chalk.cyan("Help page select: \n"))
    return helps[await selection(["Playing", "Downloading", "Options", "Quit"], ["p", "d", "o", "q"])]()
}

export {help}