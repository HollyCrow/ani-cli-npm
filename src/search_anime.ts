import {RegexParse} from "./regex";
import {curl} from "./curl";
import {input, selection} from "./input";
import chalk from "chalk";

async function search_anime(search: string){
    let filter = "*<ahref=\"/category/*\"title=\"*\">"
    let html: string[] = (await curl("https://gogoanime.dk//search.html?keyword="+search)).split("\n")
    let lines: string[] = []
    for (let x in html){
        html[x] = html[x].replaceAll(/ /g,'').replaceAll(/\t/g,'')
        if (RegexParse(html[x], filter)){
            html[x] = html[x].slice(html[x].indexOf("/category/")+10);
            html[x] = html[x].slice(0, html[x].indexOf("\"title="));
            lines.push(html[x])
        }
    }
    if (!lines[0]){
        lines.pop()
    }


    return lines
}

async function search(){
    console.clear()
    console.log(chalk.magenta("Search..."))
    let _selection = await input()
    let results:string[] = await search_anime(_selection)
    if (results[0] === undefined){
        console.log(chalk.red("No results found."))
        return 1;
    }
    return results[await selection(results)]
}



export {search}