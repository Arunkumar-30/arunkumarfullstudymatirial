import React from 'react';
import {useEffect,useState} from 'react';

interface User{}


export default function UseEffectHook({}:User){
    const [count,setCount] = useState(0);

    useEffect(()=>{
        // The code thtat we want to run
        console.log("The count is :",count)



        // optional return function to clean up the code
        return ()=>{
            console.log("Cleaning up the code")
        };
    },[count]) // dependency array
    return(
        <div>
            <h1>Use Effect Hook </h1>
            <p>Count : {count}</p>
            <button onClick={()=> setCount(count+1)}>Increment</button>
            <button onClick={()=> setCount(count-1)}>Decrement</button>
        </div>
    )
}
