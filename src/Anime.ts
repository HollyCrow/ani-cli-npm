import {curl} from "./core_utils/curl";
import {RegexParse} from "./core_utils/regex";
import {generate_link} from "./generate_link";
import {config_interface} from "./interfaces";
import {search_cache, new_cache} from "./file_managment/cache";
import {number_input, selection} from "./input";
import {write_config} from "./file_managment/load_config";
const W2GClient = require("w2g-client")
const open = require("open")
const PlayerController = require("media-player-controller")
const dl = require("download-file-with-progressbar");
const chalk = require("chalk")



class Anime{
    /*
    Class for handling a show/film

    Stores anime dpage links assigned with anime_id.

    Initialised with Anime.init()

     */

    id: string = "";
    episode_list: string[] = [];
    most_recent:number = 0;
    player:any = 0;
    current_pos:number = 0;

    async init(anime_id: string, cache_folder:string){ // init mate
        /*
        Initiate Anime object

        Will first search cache folder for cache file (this will contain id and dpage links)

        If no cache is found, it will use get_ep_bases(anime_id) to get links. (Webscrapes from animixplay.to), then creates cache

        anime_id:
         */
        let cache_object = search_cache(cache_folder, anime_id)
        this.id = anime_id
        if (cache_object == 0){
            await this.get_ep_bases(this.id)
            new_cache(cache_folder,{
                id: this.id,
                episode_list: this.episode_list,
                most_recent: this.most_recent
            })
        }else{
            try{
                this.episode_list = cache_object.episode_list
                if (cache_object.most_recent != undefined){
                    this.most_recent = cache_object.most_recent
                }
                if (cache_object.position != undefined){
                    this.current_pos = cache_object.position
                }
            }catch{
                await this.get_ep_bases(this.id)
            }
        }
        new_cache(cache_folder,{
            id: this.id,
            episode_list: this.episode_list,
            most_recent: this.most_recent
        })
        return 0;
    }

    async get_episode_link(episode:number, player:string = "VLC"){
        let episode_dpage = this.episode_list[episode]
        let id = episode_dpage.replace("//gogohd.net/streaming.php?id=","")
        id = id.slice(0, id.indexOf("="))
        let link:string = await generate_link(1,id, player)
        if (!link){
            link = await generate_link(2,id, player)
        }
        if (!link){
            console.log(chalk.red("Failed to generate links"))
        }
        if (player == "VLC" && link.includes("m3u8")){
            console.log(chalk.red("Warning; VLC is not compatible with m3u8 playlist files without custom plugins."))
        }
        return link
    }

    async get_ep_bases(anime_id:string){
        /*
        Scrapes animixplay.to for dpage links.
        returns array with all dpage links
         */
        let html = (await(curl("https://animixplay.to/v1/"+anime_id))).split("\n") //POTENTIAL BREAK POINT. animixplay.to may change domain address
        let lines = ""
        for (let x in html){
            if(RegexParse(html[x], "*<div id=\"epslistplace\"*")){
                lines = (html[x])
            }
        }
        lines = lines.slice(55, lines.length).replace("}</div>", "")
        lines = "{" + lines.slice(lines.indexOf(",")+1, lines.length) + "}"
        let json = JSON.parse(lines)
        for (const value of Object.entries(json) as unknown as string[]) {
            if (typeof value[1] == "string"){
                this.episode_list.push(value[1].replace("//gogohd.net/streaming.php?id=",""))
            }
        }
    }

    async play_head(episode:number, config:config_interface, config_dir:string){
        /*
        # Starts play cascade.

        ## Takes in:
        ### Episode number, counding from 0
        ### Config object
        ### Config save directory

         - If config.player is set to MPV or VLC, it will use the media-player-controller package.

         - If set to Browser, it will use the "open" packer.

         - If set to Link, it will simply print the media stream link to console, primarily for debuting peruses.
         */
        console.clear()
        console.log(`Playing ${this.id} episode ${episode+1} from ${new Date(this.current_pos * 1000).toISOString().slice(11, 19)}`)
        switch (config.player){
            case "MPV":
                console.log(("Opening MPV.."))
                this.player = await new PlayerController({
                    app: 'mpv',
                    args: ['--fullscreen', '--keep-open=yes', `--start=+${this.current_pos}`],
                    media: await this.get_episode_link(episode, config.player),
                    ipcPath: config.mpv_socket_path
                });

                // @ts-ignore
                await this.player.launch(err => {
                    if (err) return console.error(err.message);
                });
                break
            case "VLC":
                console.log(("Opening VLC.."))

                this.player = await new PlayerController({
                    app: 'vlc',
                    args: ['--fullscreen', `--start-time ${this.current_pos}`],
                    media: await this.get_episode_link(episode, config.player),
                    //httpPort: (config.vlc_socket !== 0)? config.vlc_socket : null,                     // HTTP port for local communication (vlc only)
                    //httpPass: (config.vlc_pass !== "")? config.vlc_socket : null,
                });

                // @ts-ignore
                await this.player.launch(err => {
                    if (err) return console.error(err.message);
                });
                break
            case "BROWSER":
                console.log(("Opening browser..."))
                await open(await this.get_episode_link(episode, config.player))
                break
            case "W2G":
                try{
                    this.player = new W2GClient.W2GClient(config.w2g_api_key);
                    await this.player.create(await this.get_episode_link(episode, config.player))
                    console.log(chalk.green("Room link: " + await this.player.getLink()));
                }catch{
                    console.log(chalk.red("Failed to create w2g.tv room. \nthis can often be because your API token is invalid. You can change it in options."))
                    process.exit()
                }
                await open(await this.player.getLink())
                break
            case "LINK":
                this.player = 1;
                console.log(await this.get_episode_link(episode, config.player))
                break
        }

        if (this.player.on !== undefined){
            this.player.on('playback', (data: any) =>{
                if (data.name == "time-pos" && data.value >= 0){
                    this.current_pos = data.value;
                }
            })
            this.player.on('app-exit', (code: any) => {
                config.most_recent.anime_id = this.id
                config.most_recent.episode_number = episode
                config.most_recent.episode_second = this.current_pos
                write_config(config_dir, config)
                this.most_recent = episode;
                new_cache(config_dir,{
                    id: this.id,
                    episode_list: this.episode_list,
                    most_recent: this.most_recent,
                    position: this.current_pos
                })
            })
        }
        await this.play(episode, config, config_dir, true)

    }

    private async play(episode:number, config:config_interface, config_dir:string, first:boolean=false){
        /*
        # Continues play cascade
        ## Continues on from play_head()
         */
        this.current_pos = 0
        if (!first){
            console.clear()
            console.log(chalk.blue(`Playing ${this.id} episode ${episode+1}`))
            if (this.player == 0){
                await open(await this.get_episode_link(episode, "BROWSER"))
            }else if(this.player == 1){
                console.log(await this.get_episode_link(episode))
            } else if (this.player.roomID != undefined){
                console.log(chalk.green("Room link: "+ await this.player.getLink()));
                this.player.update(await this.get_episode_link(episode))
            } else if (this.player.opts.app == "mpv"){
                await this.player.load(await this.get_episode_link(episode))
            }else{
                this.player.quit()
                this.player = await new PlayerController({
                    app: 'vlc',
                    args: ['--fullscreen'],
                    media: await this.get_episode_link(episode, config.player)
                });
                // @ts-ignore
                await this.player.launch(err => {
                    if (err) return console.error(err.message);
                });
            }
        }

        config.most_recent.anime_id = this.id
        config.most_recent.episode_number = episode
        config.most_recent.episode_second = this.current_pos
        write_config(config_dir, config)
        this.most_recent = episode;
        new_cache(config_dir,{
            id: this.id,
            episode_list: this.episode_list,
            most_recent: this.most_recent,
            position: this.current_pos
        })


        let selected:number; // Look, I'm sorry, but there is no way I can possibly document this in a sane way. It's a dumb patch.
        do{
            selected = await selection(
                (episode <= 0)?                        [chalk.yellow("1/n) Next"), chalk.grey("2/p) Previous"), chalk.yellow("3/s) Select"), chalk.green("4/q) Quit")]:
                    (episode >= this.episode_list.length-1)?    [chalk.grey("1/n) Next"), chalk.green("2/p) Previous"), chalk.yellow("3/s) Select"), chalk.green("4/q) Quit")] :
                                                                [chalk.yellow("1/n) Next"), chalk.green("2/p) Previous"), chalk.yellow("3/s) Select"), chalk.green("4/q) Quit")],

                ["n", "p", "s", "q"],
                ((thing:string) => {return (thing)}),
                ((thing:string) => {return (thing)}),
                true
            )
            if (!(selected != ((episode <= 0)? 1 : (episode >= this.episode_list.length-1)? 0 : -1))){
                console.log(chalk.red("Invalid choice."))
            }
        }while (!(selected != ((episode <= 0)? 1 : (episode >= this.episode_list.length-1)? 0 : -1)))

        switch(selected){
            case 0:
                if (episode >= this.episode_list.length-1){
                    await this.play(episode-1, config, config_dir)
                }else{
                    await this.play(episode+1, config, config_dir)
                }
                break
            case 1:
                if ((episode >= this.episode_list.length-1) || (episode <= 0)){
                    break
                }
                await this.play(episode-1, config, config_dir)
                break
            case 2:
                if (this.episode_list.length == 1){
                    await this.play(0, config, config_dir)
                }else{
                    console.log(`Select episode [1-${this.episode_list.length}]`)
                    await this.play(await number_input(this.episode_list.length, 1)-1, config, config_dir)
                }
                break
            case 3:
                break
        }
    }

    async download(episode:number, download_folder:string, final_ep:number){
        /*
        ## Downloads an episode (counting from 0) to download_folder, with progress bar.
         */
        try {
            // @ts-ignore
            let ep_link: string = await this.get_episode_link(episode)
            let file_name = `${this.id}-${episode + 1}.mp4`
            if (ep_link.includes(".m3u8")) console.log(chalk.red("Warning: Animixplay will download an m3u8 file. This will require some extra steps to play. It is advised to use a 3rd party website or tool to download these from the link."));
            // @ts-ignore
            let option = {
                filename: (ep_link.includes("m3u8") ? file_name.replace("mp4", "m3u8") : file_name),
                dir: download_folder,
                onDone: (final_ep > episode) ? ((info: any) => {
                    // @ts-ignore
                    console.log(chalk.green(`\n -- 1Download finished -- \nLocation: ${info.path}. Size: ${Math.round(info.size / 100000) * 10} Bytes\n`));
                    this.download(episode + 1, download_folder, final_ep)
                }) : ((info: any) => {
                    // @ts-ignore
                    console.log(chalk.green(`\n -- 2Download finished -- \n${info.path}. Size: ${Math.round(info.size / 100000) * 10} Bytes\n`));
                }),
                // @ts-ignore
                onError: (err) => {
                    console.log(chalk.red('error', err));
                    this.download(episode, download_folder, final_ep)
                },
                // @ts-ignore
                onProgress: (curr, total) => {
                    process.stdout.clearLine(0);
                    process.stdout.cursorTo(0);
                    process.stdout.write("\x1b[32m -- " + (curr / total * 100).toFixed(2) + "% " + "#".repeat(Math.ceil((curr / total) * ((process.stdout.columns - 20) / 1.5))) + "~".repeat(Math.ceil(((process.stdout.columns - 20) / 1.5) - (curr / total) * ((process.stdout.columns - 20) / 1.5))) + " -- \x1b[0m")
                }
            }
            //console.log((`${option.dir}/${option.filename}`))

            return await dl(ep_link, option);
        }catch{
            this.download(episode, download_folder, final_ep)
        }
    }

}

export {Anime}