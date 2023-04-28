import {curl} from "../core_utils/curl";
import {config} from "../config";
import {animeData} from "../interfaces";

import querystring from "querystring";


const allanimeBase:string = "allanime.to"
const agent:string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
const episodeEmbedGQL:string = "query ($showId: String!, $translationType: VaildTranslationTypeEnumType!, $episodeString: String!) {    episode(        showId: $showId        translationType: $translationType        episodeString: $episodeString    ) {        episodeString sourceUrls    }}"


async function getEpisodeLink(anime:animeData, episode:number, mode:string = "sub"){

    if (config.verbose){
        console.log(`Getting link for : ${anime.name}, episode ${episode}`)
    }

    const data = querystring.stringify({
        variables: JSON.stringify({
            showId: anime.id, // Using id as a variable from previous code
            translationType: mode, // Using mode as a variable from previous code
            episodeString: String(episode) // Using ep_no as a variable from your code
        }),
        query: episodeEmbedGQL // Using episodeEmbedGql as a variable from your code
    });

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': agent,
            cipher: 'AES256-SHA256',
        },
    };

    let JSONData:any = JSON.parse(await curl(
        {
            url: `https://api.${allanimeBase}/allanimeapi?${data}`,
            options: options
        }
    )).data.episode.sourceUrls;
    let resp:any = {}
    for (let url of JSONData){
        if (url["sourceUrl"].includes("clock?id=")){
            resp[url["sourceName"]] = url["sourceUrl"].split("clock?id=")[1]
            await getLinks(url["sourceUrl"].split("clock?id=")[1])
        }
    }
}


async function getLinks(providerID:string){
    const data = querystring.stringify({
        id: providerID
    });

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': agent,
            cipher: 'AES256-SHA256',
        },
    };

    let rawData:string = (await curl(
        {
            url: `https://allanimenews.com/apivtwo/clock.json?${data}`,
            options: options
        }
    ));

    const lines = rawData.split('\n');
    const regex1 = /.*"link":"([^"]*)".*"resolutionStr":"([^"]*)".*/;
    const regex2 = /.*"url":"([^"]*)".*"hardsub_lang":"en-US".*/;

    let output = '';
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match1 = line.match(regex1);
        const match2 = line.match(regex2);

        if (match1) {
            output += `${match1[2]} >${match1[1]}\n`;
        } else if (match2) {
            output += `${match2[1]}\n`;
        }
    }

    console.log(output.trim());


}


export {getEpisodeLink}