interface CurlOptions {
    url: string;
    options?: any;
}


interface animeData {
    id:string,
    name:string,
    availableEpisodes:{
        sub:number,
        dub:number,
        raw:number
    }
}


export {CurlOptions, animeData}