import {curl} from "../core_utils/curl";
import {config} from "../config";
import {animeData} from "../interfaces";

import querystring from "querystring";


const allanimeBase:string = "allanime.to"
const agent:string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
const episodeListGPL:string = "query ($showId: String!) {    show(        _id: $showId    ) {        _id availableEpisodesDetail    }}"


async function episodeList(anime:animeData, mode:string = "sub"): Promise<number[]>{
    if (config.verbose){
        console.log(`Searching for anime: ${anime.name}`)
    }

    const id:string = anime.id

    const data = querystring.stringify({
        variables: JSON.stringify({
            showId: id, // Using id as a variable from previous code
        }),
        query: episodeListGPL, // Using episodesListGql as a variable from previous code
    });

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': agent,
            cipher: 'AES256-SHA256',
        },
    };

    let jsonData: any = JSON.parse(await curl(
        {
            url: `https://api.${allanimeBase}/allanimeapi?${data}`,
            options: options
        }
    ));



    return jsonData.data.show.availableEpisodesDetail[mode];




}


export {episodeList}