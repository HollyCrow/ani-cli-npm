interface config_interface{
    player: string,
    proxy: string,
    user_agent: string,
    most_recent: {
        episode_number: number,
        episode_second: number,
        anime_id: string,
    }
    download_folder:string,
    debug_mode: boolean,
    mpv_socket_path: string,
    vlc_socket:number,
    vlc_pass:string,
    w2g_api_key:string
}

interface player{
    player: any,
    play: ((episode_link:string) => {}),
}


export {config_interface, player}