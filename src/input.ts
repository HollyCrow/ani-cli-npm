const _prompt = require("simple-input");

async function selection(options:string[], extra_options:string[] = []){
    for (let x in options){
        console.log(
            (parseInt(x)+1).toString()+
            ((extra_options[x] == undefined)? "" : "/"+extra_options[x])+
            ") "+options[x]
        )
    }
    let input:string = ""
    do{
        // @ts-ignore
        input = (await _prompt(">")).toLowerCase()
        console.log(input)
        for (let x in extra_options){
            if (extra_options[x].toLowerCase() == input){
                input = x+1
            }
        }
    }while(!(1 <= parseInt(input) && parseInt(input) <= options.length))
    return parseInt(input)
}

async function input(){
    return _prompt(">")
}


export {selection, input}