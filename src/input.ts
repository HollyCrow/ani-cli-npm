import chalk from "chalk";

const _prompt = require("simple-input");

async function selection(options:string[], extra_options:string[] = [], color1 = ((thing:string) => {return chalk.yellow(thing)}), color2 = ((thing:string) => {return chalk.green(thing)})){
    let color:boolean = true;
    for (let x in options){
        if (color){
            console.log(
                color1((parseInt(x)+1).toString()+
                    ((extra_options[x] == undefined)? "" : "/"+extra_options[x])+
                    ") "+options[x])
            )
        }else{
            console.log(
                color2((parseInt(x)+1).toString()+
                    ((extra_options[x] == undefined)? "" : "/"+extra_options[x])+
                    ") "+options[x])
            )
        }
        color = !color
    }
    let input:string = ""
    do{
        // @ts-ignore
        input = (await _prompt(">")).toLowerCase()
        for (let x in extra_options){
            if (extra_options[x].toLowerCase() == input){
                input = (parseInt(x)+1).toString()
            }
        }
        if (!(1 <= parseInt(input) && parseInt(input) <= options.length)){
            console.log(chalk.red("Invalid choice."))
        }
    }while(!(1 <= parseInt(input) && parseInt(input) <= options.length))
    return parseInt(input)-1
}

async function input(){
    return await _prompt(">")
}

async function number_input(max:number, min:number=1){
    let selector:string;
    let selection:number;
    do{
        selector = await _prompt(">")
        selection = parseInt(selector)
        if (selector == ""){
            selection = min
        }
        if (!(min <= selection && selection <= max)){
            console.log(chalk.red("Invalid choice."))
        }
    }while (!(min <= selection && selection <= max))

    return selection
}


async function number_input_range(max:number, min:number=1){
    let selection:string;
    do{
        selection = await _prompt(">")
        if (!(min <= parseInt(selection[0]) && parseInt(selection[0]) <= max)){
            console.log(chalk.red("Invalid choice."))
        }
    }while (!(min <= parseInt(selection[0]) && parseInt(selection[0]) <= max))
}

export {selection, input, number_input}