import * as fs from "fs"
import {Anime} from "./Anime";

function clear_cache(location:string, show:boolean){
    try{
        console.log("ye sorry that doesnt exist yet.")
        if (show){
            console.log("Cleared cache")
        }
    }catch{
        if (show){
            console.log("Failed to clear cache.")
        }
    }
}

function new_cache(location:string, anime:any){
    /*
    Creates cache of Anime object, in cache file.
     */
    try{
        fs.writeFileSync(location+"/"+anime.id+".cache", JSON.stringify(anime))
    }catch{
        console.log("Failed to write to cache")
    }
}

function get_cache(location:string, anime_id:string){
    /*
    ## Get cache by anime_id. Does not check if the cache exists.
     */
    return JSON.parse(fs.readFileSync(location+"/"+anime_id+".cache").toString())
}

function search_cache(cache_folder:string, anime_id:string){
    /*
    ## Searches cache folder for cache file with name of anime_id, at the location of cache_folder

    ### returns boolean for weather it is found.
     */
    try{
        if (check_cache(cache_folder, anime_id)){
            return get_cache(cache_folder, anime_id)
        }
        return false
    }catch{
        return false
    }
}

function check_cache(location:string, anime_id:string){
    return fs.readdirSync(location).includes(anime_id+".cache")
}


export {clear_cache, new_cache, search_cache}