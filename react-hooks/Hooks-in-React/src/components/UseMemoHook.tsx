import { useMemo, useState } from 'react'
import { initialItems } from '../utils';

interface User{}

export default function UseMemoHook({}:User){
    const [count,setCount] = useState(0);
    const [items]= useState(initialItems);

    // const selectedItem = items.find((item) => item.isSelected);
    // console.log("selectedItem",selectedItem)
    
    const selectedItem = useMemo(()=>{
      console.log("=======")
        return items.find((item) => item.id === count);
    },[count,items])

  return (
    <div>
      <h1>UseMemoHook</h1>
        <h2>Count: {count}</h2>
        <h2>Selected Item: {selectedItem?.id}</h2>
        <button onClick={() => setCount(count+1)}>Increment</button>
    </div>
  )
}

