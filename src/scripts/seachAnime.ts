import {curl} from "../core_utils/curl";
import {config} from "../config";
import {animeData} from "../interfaces";

import querystring from "querystring";


const allanimeBase:string = "allanime.to"
const agent:string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
const searchGPL:string = "query(        $search: SearchInput        $limit: Int        $page: Int        $translationType: VaildTranslationTypeEnumType        $countryOrigin: VaildCountryOriginEnumType    ) {    shows(        search: $search        limit: $limit        page: $page        translationType: $translationType        countryOrigin: $countryOrigin    ) {        edges {            _id name availableEpisodes __typename       }    }}"


async function searchAnime(searchQuery:string, mode:string = "sub"): Promise<animeData[]>{
    /*
    * ## searchAnime(searchQuery:string, mode:string = "sub"): Promise<animeData[]> {}
    *
    *  - searchQuery: String to search for
    *
    *  - mode: "sub"/"dub". Defaults to sub.
    *
    */
    if (config.verbose){
        console.log(`Searching for anime: ${searchQuery}`)
    }

    const data = querystring.stringify({
        variables: JSON.stringify({
            search: {
                allowAdult: false,
                allowUnknown: false,
                query: searchQuery,
            },
            limit: 40,
            page: 1,
            translationType: mode,
            countryOrigin: 'ALL'
        }),
        query: searchGPL
    });

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': agent,
            cipher: 'AES256-SHA256',
        },
    };

    let jsonData:any = JSON.parse(await curl(
        {
            url:`https://api.${allanimeBase}/allanimeapi?${data}`,
            options: options
        }
    ));

    if (!jsonData.data.shows){
        console.log("ERROR: Failed to parse anime search json data")
        return [];
    }

    let shows:animeData[] = [];

    for (const show of jsonData.data.shows.edges){
        shows.push({
            id: show._id,
            name: show.name,
            availableEpisodes: {
                sub: show.availableEpisodes.sub,
                dub:show.availableEpisodes.dub,
                raw:show.availableEpisodes.raw
            }
        })
    }








    return shows;
}


export {searchAnime}