import {RegexParse} from "./regex";
import {curl} from "./curl";
import {input} from "./input";
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
    console.log(chalk.magenta("Search..."))
    let selection = input()
}

export {search_anime}