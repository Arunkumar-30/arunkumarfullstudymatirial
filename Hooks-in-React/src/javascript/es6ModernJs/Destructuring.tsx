import React, { useEffect } from 'react'

interface User{
    name:string,
    age:number,
    city:string,
    country:string
}

const Destructuring = () => {

    useEffect(()=>{
       const user:User = {name:"Arun",age:24,city:"chennai",country:''};
    //    old way
    // const name1 = user.name;
    // const age1 = user.age;
    // const city1 = user.city;

    //   Destructuring
    const {name,age,city} = user;
    console.log(name,age,city);

    // rename while destructuring
    const {name:userName,age:userAge}=user;
    console.log("userName",userName, "userAge",userAge)

    // Default values
const { country = "India" } = user;
console.log('country',country); // "India" (not in object)


const colors = ["red", "green", "blue"];

const [first, second] = colors;
console.log(first, second); // "red" "green"

// Skip elements with comma
const [,, third] = colors;
console.log(third); // "blue"

// Swap variables — classic trick!
let x = 1, y = 2;
[x, y] = [y, x];
console.log(`x=${x} y=${y}`); // x=2 y=1

console.log("------------------------------------------------------")
    },[])
  return (
    <div>
      
    </div>
  )
}

export default Destructuring
