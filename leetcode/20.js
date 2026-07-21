var isValid = function(s){
    const stact =[]
    const parens = "() {} []";
    let i = 0;

    while(i<s.length){
        stact.push(s[i])
        i++;

        let open = stact[stact.length -2];
        let close = stact[stact.length -1];
        
        let potParens = open + close;
        if(parens.includes(potParens)){
            stact.pop()
            stact.pop()
        }
    }
    return stact.length === 0;
}

 s = "()[]{}"
isValid(s)