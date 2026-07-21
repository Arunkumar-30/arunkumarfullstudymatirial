import React from 'react';
import {useState} from 'react';

interface User{}


export default function UseStateHook({}:User){
    const [count,setCount] = useState(0);
    return(
        <div>
            <h1>Use State Hook </h1>
            <p>Count : {count}</p>
            <button onClick={()=> setCount(count+1)}>Increment</button>
            <button onClick={()=> setCount(count-1)}>Decrement</button>
        </div>
    )
}
