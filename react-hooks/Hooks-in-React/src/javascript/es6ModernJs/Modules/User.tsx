import React, { useEffect } from 'react'
// Import specific names
import { add, PI } from "./math.ts";


// Import everything as a namespace
import * as Math from "./math.ts";

// app.js — import default (any name you like)
import greet from "./math.ts";
import sayHi from "./math.ts"; // also valid


const User = () => {
    useEffect(()=>{
        console.log(add(2, 3)); // 5
console.log(PI);          // 3.14159 
console.log(Math.multiply(4, 5)); // 20

  const result1 = greet("arun")
  console.log(result1)
  const result2 = sayHi("kumar")
  console.log(result2)
    },[])
  return (
    <div>
      Modules — import & export ES6
Modules let you split your code into separate files and share only what you need. This is how every React and React Native project is structured.
    </div>
  )
}

export default User
