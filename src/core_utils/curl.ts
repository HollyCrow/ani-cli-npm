import https from "https";

import {config} from "../config";
import {CurlOptions} from "../interfaces";

const agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'; // Replace with your desired User-Agent string



function curl(options: CurlOptions): any {

    if (!options.options) {
        options.options = {
            method: "GET",
            headers: {
                'User-Agent': agent
            },
        }
    }

    return new Promise((resolve, reject) => {
        https.get(options.url, options.options, (response: any) => {
            let html = '';

            // Receive data in chunks and append to the html variable
            response.on('data', (chunk: any) => {
                html += chunk;
            });

            // Handle the end of the response
            response.on('end', () => {
                resolve(html);
            });

            // Handle errors
            response.on('error', (error: any) => {
                reject(error);
            });
        }).on('error', (error: any) => {
            if (config.verbose){
                reject(error);
            }else{
                console.log("ERROR: FAILED TO FETCH "+options.url)
            }
        });
    });


}

export {curl, CurlOptions}