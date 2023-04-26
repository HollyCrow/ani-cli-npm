import {config} from "./config";
import {searchAnime} from "./scripts/seachAnime";

async function main(){
    console.log(await searchAnime("naruto"));
}

main()