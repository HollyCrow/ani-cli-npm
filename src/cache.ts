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

function new_cache(location:string, anime:Anime, show:boolean){
    try{
        fs.writeFileSync(location+"/"+anime.id+".cache", JSON.stringify(anime))
    }catch{
        if (show){
            console.log("Failed to write to cache")
        }
    }
}

function get_cache(location:string, anime_id:string){
    return JSON.parse(fs.readFileSync(location+"/"+anime_id+".cache").toString())
}

function search_cache(location:string, anime_id:string){
    //try{
        if (check_cache(location, anime_id)){
            return get_cache(location, anime_id)
        }
        return 0
    // }catch{
    //     return 0
    // }
}

function check_cache(location:string, anime_id:string){
    return fs.readdirSync(location).includes(anime_id+".cache")
}


export {clear_cache, new_cache, search_cache}