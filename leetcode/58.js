s = "Hello World"
    let i = s.length - 1;
    let count = 0;

    // Step 1: Skip trailing spaces
    while (i >= 0 && s[i] === " ") {
        i--;
    }


    // Step 2: Count characters of last word
    while (i >= 0 && s[i] !== " ") {
        count++;
        i--;
    }

   console.log(count);