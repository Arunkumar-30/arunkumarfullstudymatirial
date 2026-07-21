import React, { useEffect, useState } from 'react'

interface User{
    name:string;
}

const LocalStorage:React.FC = () => {
    const [name,setName] = useState<User>({name:""})
    useEffect(()=>{
        const LocalStore = ()=>{
            // save the value
            localStorage.setItem("username","Arjun")
            localStorage.setItem("password","1234")

            // read the value(returns null if not found)
            const lname = localStorage.getItem("username")
             if(lname){
                setName({
                    name:lname
                })
             }
            console.log(lname);

            // remove one key
            // localStorage.removeItem("username")

            // remove everything
            // localStorage.clear()

            // count keys
            console.log(localStorage.length);

        }
        LocalStore()
    },[])
  return (
    <div>
       <h1>Local Storage</h1> 
       <p>Name: {name.name}</p>

    </div>
  )
}

export default LocalStorage
