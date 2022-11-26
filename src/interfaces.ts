interface config_interface{
    player: string,
    proxy: string,
    user_agent: string,
    most_recent: {
        episode_number: number,
        anime_id: string
    }
    download_folder:string
}


export {config_interface}