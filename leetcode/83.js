head = [1,1,2]
k = []

for(let i = 0; i < head.length; i++) {
    if (head[i] !== head[i-1]) {
        k.push(head[i])
    }
}
console.log(k)