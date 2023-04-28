import {config} from "./config";
import {animeData} from "./interfaces";
import {searchAnime} from "./scripts/seachAnime";
import {episodeList} from "./scripts/episodeList";
import {getEpisodeLink} from "./scripts/getEpisodeLink";

async function main(){
    let list:animeData = (await searchAnime("naruto", "dub"))[0];
    console.log(list.id);

    console.log(await episodeList(list))

    await getEpisodeLink(list, 1)
}

main()