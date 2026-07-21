import React, { useEffect } from 'react'

const SpreadRest = () => {
    useEffect(()=>{
        // spread — expand
// Copy & merge arrays
const a = [1, 2, 3];
const b = [4, 5];
const merged = [...a, ...b];
console.log(merged); // [1,2,3,4,5]

// Copy & update objects
const user = { name: "Raj", age: 25 };
const updated = { ...user, age: 26, city: "Madurai" };
console.log(updated);

// Spread into function args
const nums = [3, 1, 4, 1, 5];
console.log(Math.max(...nums)); // 5
console.log("-------------------------------------------------")
// rest — collect
// Collect remaining args in a function
function sum(...numbers:any[]) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// Rest in destructuring
const [head, ...tail] = [10, 20, 30, 40];
console.log(head); // 10
console.log(tail); // [20, 30, 40]
    },[])
  return (
    <div>
       <h1>Spread & Rest Operator ES6
Both use ... — spread expands an array/object, rest collects multiple values into one. Same syntax, opposite direction. </h1>
    </div>
  )
}

export default SpreadRest
